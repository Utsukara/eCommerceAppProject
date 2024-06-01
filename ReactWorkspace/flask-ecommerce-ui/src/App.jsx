import React, { Component } from "react";
import CustomerList from "./components/CustomerList";
import ProductList from "./components/ProductList";
import CustomerForm from "./components/CustomerForm";
import ProductForm from "./components/ProductForm";
import './AppStyles.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      selectedCustomerID: null,
      selectedProductID: null
    };
  }

  handleCustomerSelect = (customerID) => {
    this.setState({ selectedCustomerID: customerID });
  }

  updateCustomerList = () => {
    this.customerListRef.fetchCustomers();
  }

  handleProductUpdated = () => {
    this.productListRef.fetchProducts();
  }

  handleProductSelect = (productID) => {
    this.setState({ selectedProductID: productID });
  }

  render() {
    const { selectedCustomerID, selectedProductID } = this.state;

    return (
      <div className='app-container'>
        <h1>Our Customers</h1>
        <CustomerForm customerID={selectedCustomerID} onUpdateCustomerList={this.updateCustomerList} />
        <CustomerList ref={ref => this.customerListRef = ref} onCustomerSelect={this.handleCustomerSelect} />
        <h1>Our Products</h1>
        <ProductForm selectedProductID={selectedProductID} onUpdateProductList={this.handleProductUpdated} />
        <ProductList ref={ref => this.productListRef = ref} onProductSelect={this.handleProductSelect} />
      </div>
    );
  }
}

export default App;
