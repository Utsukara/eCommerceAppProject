import axios from "axios";
import React, { Component } from "react";
import { Form, Button, Container, Alert, Modal } from 'react-bootstrap';

class ProductForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: "",
            price: "",
            errors: {},
            submitError: null,
            selectedProductID: null,
            showSuccessModal: false
        };
    }

    componentDidMount() {
        const { id } = this.props.params;
        if (id) {
            this.fetchProductData(id);
        }
    }

    componentDidUpdate(prevProps) {
        const { id } = this.props.params;
        if (prevProps.params.id !== id) {
            if (id) {
                this.fetchProductData(id);
            } else {
                this.clearForm();
            }
        }
    }

    fetchProductData = (id) => {
        axios.get(`http://127.0.0.1:5000/products/${id}`)
            .then(response => {
                const { name, price } = response.data;
                this.setState({
                    name,
                    price: price.toString(),
                    selectedProductID: id
                });
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });
    }

    clearForm = () => {
        this.setState({
            name: "",
            price: "",
            errors: {},
            submitError: null,
            selectedProductID: null
        });
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    validateForm = () => {
        const { name, price } = this.state;
        const errors = {};
        if (!name) errors.name = "Name is required";
        if (!price) {
            errors.price = "Price is required";
        } else if (isNaN(price) || parseFloat(price) <= 0) {
            errors.price = "Price must be a positive number";
        }
        return errors;
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const errors = this.validateForm();
        this.setState({ errors });
        if (Object.keys(errors).length === 0) {
            const productData = {
                name: this.state.name.trim(),
                price: parseFloat(this.state.price)
            };
            const apiURL = this.state.selectedProductID ?
                `http://127.0.0.1:5000/products/${this.state.selectedProductID}` :
                'http://127.0.0.1:5000/products';

            const httpMethod = this.state.selectedProductID ? axios.put : axios.post;

            httpMethod(apiURL, productData)
                .then(() => {
                    this.setState({
                        showSuccessModal: true
                    });
                })
                .catch(error => {
                    this.setState({ submitError: error.message });
                }
            );
        } else {
            this.setState({ submitError: null });
        }
    };

    closeModal = () => {
        this.setState({
            showSuccessModal: false,
            name: "",
            price: "",
            errors: {},
            submitError: null,
            selectedProductID: null
        });
        this.props.navigate("/products");
    }

    render() {
        const { name, price, errors, submitError, showSuccessModal } = this.state;
        return (
            <Container>
                <h3>{this.state.selectedProductID ? "Edit Product" : "Add Product"}</h3>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formName" className="form-group-spacing">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={name}
                            onChange={this.handleChange}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formPrice" className="form-group-spacing">
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type="number"
                            step="0.01"
                            name="price"
                            value={price}
                            onChange={this.handleChange}
                            isInvalid={!!errors.price}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.price}
                        </Form.Control.Feedback>
                    </Form.Group>

                    {submitError && <Alert variant="danger">{submitError}</Alert>}

                    <Button variant="primary" type="submit" className="button-spacing">
                        Submit
                    </Button>
                </Form>

                <Modal show={showSuccessModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Success</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Product information has been successfully {this.state.selectedProductID ? "updated" : "added"}.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        );
    }
}

export default ProductForm;
