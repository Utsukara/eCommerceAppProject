import React, { Component } from "react";
import axios from 'axios';
import { Container, ListGroup, Card } from 'react-bootstrap';
import { useParams } from "react-router-dom";

class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      order: null,
    };
  }

  componentDidMount() {
    const { id } = this.props.params;
    this.fetchOrderDetails(id);
  }

  fetchOrderDetails = (id) => {
    axios.get(`http://127.0.0.1:5000/orders/${id}`)
      .then(response => {
        this.setState({ order: response.data });
      })
      .catch(error => {
        console.error('Error fetching order details:', error);
      });
  }

  render() {
    const { order } = this.state;

    if (!order) {
      return <div>Loading...</div>;
    }

    return (
      <Container>
        <Card>
          <Card.Header>Order Details</Card.Header>
          <Card.Body>
            <Card.Title>Order ID: {order.id}</Card.Title>
            <Card.Text>Date: {new Date(order.date).toLocaleString()}</Card.Text>
            <h5>Products:</h5>
            <ListGroup>
              {order.products.map(product => (
                <ListGroup.Item key={product.id}>
                  {product.name}: ${product.price}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </Container>
    );
  }
}

export default function OrderDetailsWrapper() {
  const params = useParams();
  return <OrderDetails params={params} />;
}
