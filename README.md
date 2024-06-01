# eCommerceAppProject

HelloKitty Cafe API Description
The HelloKitty Cafe API is designed to manage customers, orders, and products for an e-commerce platform. The API provides endpoints for CRUD operations (Create, Read, Update, Delete) for customers and products, as well as the ability to place and manage orders. The implementation is straightforward and effective for the intended purposes, providing a simple yet functional backend for the HelloKitty Cafe.

Key Features:
Customer Management: Create, read, update, and delete customer information.
Product Management: Create, read, update, and delete product details.
Order Management: Place orders, retrieve order details, and manage order history.
**Important Note:**
**The app.py script includes metadata for database schema creation. However, there may be issues with automatic database creation in MySQL. Users might need to manually create the necessary databases and tables using MySQL Workbench or another database management tool.**
API Endpoints
Customer Endpoints:
GET /customers: Retrieve a list of all customers.
GET /customers/{id}: Retrieve details of a specific customer by ID.
POST /customers: Create a new customer.
PUT /customers/{id}: Update details of an existing customer by ID.
DELETE /customers/{id}: Delete a customer by ID.
Product Endpoints:
GET /products: Retrieve a list of all products.
GET /products/{id}: Retrieve details of a specific product by ID.
POST /products: Create a new product.
PUT /products/{id}: Update details of an existing product by ID.
DELETE /products/{id}: Delete a product by ID.
Order Endpoints:
GET /orders: Retrieve a list of all orders.
GET /orders/{id}: Retrieve details of a specific order by ID.
POST /orders: Place a new order.
PUT /orders/{id}: Update details of an existing order by ID.
DELETE /orders/{id}: Delete an order by ID.
GET /orders/{order_id}/products: Retrieve products associated with a specific order.
GET /customers/{customer_id}/orders: Retrieve orders placed by a specific customer.

**Implementation Details**

Customer Management
The customer endpoints allow for managing customer information, including their name, email, and phone number. The customer model also supports relationships with customer accounts and orders, enabling a comprehensive customer management system.

Product Management
The product endpoints manage product details such as name and price. Products are associated with orders, allowing for easy retrieval of products within orders.

Order Management
Orders link customers and products, capturing the details of each transaction. The API supports placing new orders, updating existing orders, retrieving order details, and managing order history. Each order captures the order date and the associated customer and products.

Database Considerations
The app.py script includes metadata to create tables if they don't exist. However, due to potential issues with automatic database creation in MySQL, users might need to manually create the databases and tables in MySQL Workbench or a similar tool. The provided metadata aims to streamline this process, but manual intervention might be necessary to ensure the database is set up correctly.
