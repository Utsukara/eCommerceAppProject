import React, { Component } from "react";
import PropTypes from 'prop-types';
import axios from 'axios';
import { ListGroup, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
    const { products } = this.state;
    return (
      <Container>
        <h3>Products</h3>
        <ListGroup>
          {products.map(product => (
            <ListGroup.Item
              key={product.id}
              className="d-flex justify-content-between align-items-center list-group-item-hover"
              onClick={() => this.selectedProduct(product.id)}
            >
              <Link to={`/edit-product/${product.id}`}>{product.name}: ${product.price}</Link>
              <Button variant="danger" size="sm" className="ml-3" onClick={(e) => { e.stopPropagation(); this.deleteProduct(product.id); }}>Delete</Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Container>
    );
  }
}

ProductList.propTypes = {
  onProductSelect: PropTypes.func.isRequired
};

export default ProductList;