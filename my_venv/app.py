import datetime
import logging
from typing import List
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from marshmallow import fields, ValidationError
from sqlalchemy import select
from sqlalchemy.orm import Session, declarative_base, relationship, mapped_column, Mapped
from sqlalchemy.ext.declarative import DeclarativeMeta

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:Kellyisnothelping24*@localhost:3306/e_commerce_db'
CORS(app)

Base: DeclarativeMeta = declarative_base()
ma = Marshmallow(app)
db = SQLAlchemy(app, model_class=Base)

# Association table for Order and Product
order_product = db.Table(
    'order_product',  # Use lowercase for table names
    Base.metadata,
    db.Column('order_id', db.ForeignKey('orders.id'), primary_key=True),  # Reference lowercase table names
    db.Column('product_id', db.ForeignKey('products.id'), primary_key=True),  # Reference lowercase table names
)

# Models
class Customer(Base):
    __tablename__ = 'customers' # Use lowercase for table names
    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    name: Mapped[str] = mapped_column(db.String(255), nullable=False)
    email: Mapped[str] = mapped_column(db.String(255), nullable=False)
    phone: Mapped[str] = mapped_column(db.String(255), nullable=False)
    customer_account: Mapped['CustomerAccount'] = relationship('CustomerAccount', back_populates='customer', uselist=False)
    orders: Mapped[List['Order']] = relationship('Order', back_populates='customer')

class Order(Base):
    __tablename__ = 'orders' # Use lowercase for table names
    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    date: Mapped[datetime.datetime] = mapped_column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    customer_id: Mapped[int] = mapped_column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    customer: Mapped['Customer'] = relationship('Customer', back_populates='orders')
    products: Mapped[List['Product']] = relationship('Product', secondary=order_product, back_populates='orders')

class CustomerAccount(Base):
    __tablename__ = 'customeraccounts' # Use lowercase for table names
    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    username: Mapped[str] = mapped_column(db.String(255), nullable=False)
    password: Mapped[str] = mapped_column(db.String(255), nullable=False)
    customer_id: Mapped[int] = mapped_column(db.Integer, db.ForeignKey('customers.id'), nullable=False)
    customer: Mapped['Customer'] = relationship('Customer', back_populates='customer_account')

class Product(Base):
    __tablename__ = 'products' # Use lowercase for table names
    id: Mapped[int] = mapped_column(db.Integer, primary_key=True)
    name: Mapped[str] = mapped_column(db.String(255), nullable=False)
    price: Mapped[float] = mapped_column(db.Float, nullable=False)
    orders: Mapped[List['Order']] = relationship('Order', secondary=order_product, back_populates='products')

class CustomerSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Customer

class OrderSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Order
    products = fields.List(fields.Nested(lambda: ProductSchema(only=("id", "name", "price"))))

class ProductSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Product

customer_schema = CustomerSchema()
customers_schema = CustomerSchema(many=True)
order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)
product_schema = ProductSchema()
products_schema = ProductSchema(many=True)

@app.route('/customers', methods=['GET'])
def get_customers():
    customers = db.session.execute(select(Customer)).scalars().all()
    return customers_schema.jsonify(customers)

@app.route('/customers', methods=['POST'])
def create_customer():
    try:
        customer_data = customer_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    new_customer = Customer(**customer_data)
    db.session.add(new_customer)
    db.session.commit()
    return customer_schema.jsonify(new_customer), 201

@app.route('/customers/<int:id>', methods=['PUT'])
def update_customer(id):
    try:
        customer_data = customer_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    customer = db.session.get(Customer, id)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404

    for key, value in customer_data.items():
        setattr(customer, key, value)

    db.session.commit()
    return customer_schema.jsonify(customer)

@app.route('/customers/<int:id>', methods=['DELETE'])
def delete_customer(id):
    customer = db.session.get(Customer, id)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404

    db.session.delete(customer)
    db.session.commit()
    return '', 204

@app.route('/customers/<int:customer_id>/orders', methods=['GET'])
def get_orders_for_customer(customer_id):
    customer = db.session.get(Customer, customer_id)
    if not customer:
        return jsonify({'error': 'Customer not found'}), 404

    orders = db.session.execute(select(Order).filter_by(customer_id=customer_id)).scalars().all()
    return orders_schema.jsonify(orders)

@app.route('/orders', methods=['GET'])
def get_orders():
    orders = db.session.execute(select(Order)).scalars().all()
    return orders_schema.jsonify(orders)

@app.route('/orders', methods=['POST'])
def create_order():
    try:
        order_data = order_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    new_order = Order(**order_data)
    db.session.add(new_order)
    db.session.commit()
    return order_schema.jsonify(new_order), 201

@app.route('/orders/<int:id>', methods=['PUT'])
def update_order(id):
    try:
        order_data = order_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    order = db.session.get(Order, id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    for key, value in order_data.items():
        setattr(order, key, value)

    db.session.commit()
    return order_schema.jsonify(order)

@app.route('/orders/<int:id>', methods=['DELETE'])
def delete_order(id):
    order = db.session.get(Order, id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    db.session.delete(order)
    db.session.commit()
    return '', 204

@app.route('/orders/<int:order_id>/products', methods=['GET'])
def get_products_for_order(order_id):
    order = db.session.get(Order, order_id)
    if not order:
        return jsonify({'error': 'Order not found'}), 404

    products = db.session.execute(select(Product).join(order_product).filter(order_product.c.order_id == order_id)).scalars().all()
    return products_schema.jsonify(products)

@app.route('/products', methods=['GET'])
def get_products():
    products = db.session.execute(select(Product)).scalars().all()
    return products_schema.jsonify(products)

@app.route('/products', methods=['POST'])
def create_product():
    try:
        product_data = product_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    new_product = Product(**product_data)
    db.session.add(new_product)
    db.session.commit()
    return product_schema.jsonify(new_product), 201

@app.route('/products/<int:id>', methods=['PUT'])
def update_product(id):
    try:
        product_data = product_schema.load(request.json)
    except ValidationError as err:
        return jsonify(err.messages), 400

    product = db.session.get(Product, id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    for key, value in product_data.items():
        setattr(product, key, value)

    db.session.commit()
    return product_schema.jsonify(product)

@app.route('/products/<int:id>', methods=['DELETE'])
def delete_product(id):
    product = db.session.get(Product, id)
    if not product:
        return jsonify({'error': 'Product not found'}), 404

    db.session.delete(product)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    with app.app_context():
        Base.metadata.create_all(db.engine)  # Create tables if they don't exist
    app.run(debug=True)
