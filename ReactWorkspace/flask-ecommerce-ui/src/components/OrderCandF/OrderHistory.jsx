import React, { Component } from "react";
import axios from 'axios';
import { ListGroup, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class OrderHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
    };
  }

  componentDidMount() {
    this.fetchOrders();
  }

  fetchOrders = () => {
    axios.get('http://127.0.0.1:5000/orders')
      .then(response => {
        this.setState({ orders: response.data });
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }

  render() {
    const { orders } = this.state;
    return (
      <Container>
        <h3>Order History</h3>
        <ListGroup>
          {orders.map(order => (
            <ListGroup.Item key={order.id}>
              <Link to={`/order-details/${order.id}`}>
                Order ID: {order.id}, Date: {new Date(order.date).toLocaleString()}
              </Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    );
  }
}

export default OrderHistory;

