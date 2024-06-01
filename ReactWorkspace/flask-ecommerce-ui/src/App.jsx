import React, { Component } from "react";
import CustomerList from "./components/CustomerList";
import OrderList from "./components/OrderList";
import ProductList from "./components/ProductList";
import CustomerForm from "./components/CustomerForm";
import ProductForm from "./components/ProductForm";
import './AppStyles.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      selectedCustomerID: null,
      selectedOrderID: null
    };
  }

  handleCustomerSelect = (customerID) => {
    this.setState({ selectedCustomerID: customerID });
  }

  updateCustomerList = () => {
    this.customerListRef.fetchCustomers();
  }

  handleOrderSelect = (orderID) => {
    this.setState({ selectedOrderID: orderID });
  }

  render() {
    const { selectedCustomerID, selectedOrderID } = this.state;

    return (
      <div className='app-container'>
        <h1>Our Customers</h1>
        <CustomerForm customerID={selectedCustomerID} onUpdateCustomerList={this.updateCustomerList} />
        <CustomerList ref={ref => this.customerListRef = ref} onCustomerSelect={this.handleCustomerSelect} />
      </div>
    );
  }
}

export default App;
