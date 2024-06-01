import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import axios from 'axios';

const ProductList = ({ orderID }) => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/orders/${orderID}/products`);
        setProducts(response.data);
      }
      catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products');
      }
    }
    if (orderID) {
      fetchProducts();
    }
  }, [orderID]);

  return (
    <div className="product-list">
      <h3>Products</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} (ID: {product.id})
          </li>
        ))}
      </ul>
    </div>
  );
}

ProductList.propTypes = {
  orderID: PropTypes.number.isRequired
};

export default ProductList;
