import React, { Component } from "react";
import PropTypes from 'prop-types';
import axios from 'axios';

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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedCustomerID !== this.state.selectedCustomerID) {
      console.log(`Selected Customer ID: ${this.state.selectedCustomerID}`);
    }
  }

  componentWillUnmount() {
    console.log('CustomerList component unmounted');
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
    return (
      <div className="customer-list">
        <h3>Customers</h3>
        <ul>
          {this.state.customers.map((customer) => (
            <li key={customer.id} onClick={() => this.selectedCustomer(customer.id)}>
              {customer.name}
              <button onClick={(e) => { e.stopPropagation(); this.deleteCustomer(customer.id); }}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

CustomerList.propTypes = {
  onCustomerSelect: PropTypes.func.isRequired
};

export default CustomerList;
