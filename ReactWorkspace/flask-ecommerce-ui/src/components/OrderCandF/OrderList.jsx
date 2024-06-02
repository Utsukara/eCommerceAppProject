import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const OrderList = ({ customerID, onOrderSelect }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/customers/${customerID}/orders`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Error fetching orders');
      }
    };
    if (customerID) {
      fetchOrders();
    }
  }, [customerID]);

  return (
    <div className="order-list">
      <h3>Orders</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <ul>
        {orders.map((order) => (
          <li key={order.id} onClick={() => onOrderSelect(order.id)}>
            Order ID: {order.id}, Date: {order.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

OrderList.propTypes = {
  customerID: PropTypes.number.isRequired,
  onOrderSelect: PropTypes.func.isRequired
};

export default OrderList;
