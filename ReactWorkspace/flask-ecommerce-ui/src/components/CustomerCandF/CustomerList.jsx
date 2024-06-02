import React, { Component } from "react";
import PropTypes from 'prop-types';
import axios from 'axios';
import { ListGroup, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class CustomerList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      customers: [],
      selectedCustomerID: null
    };
  }

  componentDidMount() {
    this.fetchCustomers();
  }

  fetchCustomers = () => {
    axios.get('http://127.0.0.1:5000/customers')
      .then(response => {
        this.setState({ customers: response.data });
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });
  }

  selectedCustomer = (id) => {
    this.setState({ selectedCustomerID: id });
    this.props.onCustomerSelect(id);
  }

  deleteCustomer = (id) => {
    axios.delete(`http://127.0.0.1:5000/customers/${id}`)
      .then(response => {
        console.log('Customer deleted:', response.data);
        this.fetchCustomers();
      })
      .catch(error => {
        console.error('Error deleting customer:', error);
      });
  }

  render() {
    const { customers } = this.state;
    return (
      <Container>
        <h3>Customers</h3>
        <ListGroup>
          {customers.map(customer => (
            <ListGroup.Item
              key={customer.id}
              className="d-flex justify-content-between align-items-center list-group-item-hover"
              onClick={() => this.selectedCustomer(customer.id)}
            >
              <Link to={`/edit-customer/${customer.id}`}>ID {customer.id} : {customer.name}</Link>
              <Button variant="danger" size="sm" className="ml-3" onClick={(e) => { e.stopPropagation(); this.deleteCustomer(customer.id); }}>Delete</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    );
  }
}

CustomerList.propTypes = {
  onCustomerSelect: PropTypes.func.isRequired
};

export default CustomerList;
