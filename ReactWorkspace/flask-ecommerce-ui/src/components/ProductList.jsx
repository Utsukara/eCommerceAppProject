import React, { Component } from "react";
import PropTypes from 'prop-types';
import axios from 'axios';

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      products: [],
      selectedProductID: null
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

  fetchProducts = () => {
    axios.get('http://127.0.0.1:5000/products')
      .then(response => {
        this.setState({ products: response.data });
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedProductID !== this.state.selectedProductID) {
      console.log(`Selected Product ID: ${this.state.selectedProductID}`);
    }
  }

  componentWillUnmount() {
    console.log('ProductList component unmounted');
  }

  selectedProduct = (id) => {
    this.setState({ selectedProductID: id });
    this.props.onProductSelect(id);
  }

  deleteProduct = (id) => {
    axios.delete(`http://127.0.0.1:5000/products/${id}`)
      .then(response => {
        console.log('Product deleted:', response.data);
        this.fetchProducts();
      })
      .catch(error => {
        console.error('Error deleting product:', error);
      });
  }

  render() {
    return (
      <div className="product-list">
        <h3>Products</h3>
        <ul>
          {this.state.products.map((product) => (
            <li key={product.id} onClick={() => this.selectedProduct(product.id)}>
              {product.name}: ${product.price}
              <button onClick={(e) => { e.stopPropagation(); this.deleteProduct(product.id); }}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

ProductList.propTypes = {
  onProductSelect: PropTypes.func.isRequired
};

export default ProductList;
