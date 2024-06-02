import axios from "axios";
import React, { Component } from "react";
import { Form, Button, Container, Alert, Modal } from 'react-bootstrap';
import Select from 'react-select';

class PlaceOrderForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            customerID: "",
            productID: "",
            quantity: 1,
            products: [],
            errors: {},
            submitError: null,
            showSuccessModal: false
        };
    }

    componentDidMount() {
        this.fetchProducts();
    }

    fetchProducts = () => {
        axios.get('http://127.0.0.1:5000/products')
            .then(response => {
                const products = response.data.map(product => ({
                    value: product.id,
                    label: `${product.name} ($${product.price})`
                }));
                this.setState({ products });
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSelectChange = (selectedOption) => {
        this.setState({ productID: selectedOption ? selectedOption.value : "" });
    }

    validateForm = () => {
        const { customerID, productID, quantity } = this.state;
        const errors = {};
        if (!customerID) errors.customerID = "Customer ID is required";
        if (!productID) errors.productID = "Product is required";
        if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) errors.quantity = "Quantity must be a positive number";
        return errors;
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const errors = this.validateForm();
        this.setState({ errors });
        if (Object.keys(errors).length === 0) {
            const orderData = {
                customer_id: this.state.customerID.trim(),
                product_id: this.state.productID.trim(),
                quantity: parseInt(this.state.quantity)
            };

            axios.post('http://127.0.0.1:5000/orders', orderData)
                .then(() => {
                    this.setState({
                        showSuccessModal: true
                    });
                })
                .catch(error => {
                    this.setState({ submitError: error.message });
                });
        } else {
            this.setState({ submitError: null });
        }
    };

    closeModal = () => {
        this.setState({
            showSuccessModal: false,
            customerID: "",
            productID: "",
            quantity: 1,
            errors: {},
            submitError: null
        });
    }

    render() {
        const { customerID, productID, quantity, products, errors, submitError, showSuccessModal } = this.state;
        return (
            <Container>
                <h3>Place Order</h3>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formCustomerID" className="form-group-spacing">
                        <Form.Label>Customer ID</Form.Label>
                        <Form.Control
                            type="text"
                            name="customerID"
                            value={customerID}
                            onChange={this.handleChange}
                            isInvalid={!!errors.customerID}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.customerID}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formProductID" className="form-group-spacing">
                        <Form.Label>Product</Form.Label>
                        <Select
                            name="productID"
                            value={products.find(option => option.value === productID)}
                            onChange={this.handleSelectChange}
                            options={products}
                            isClearable
                            isSearchable
                        />
                        {errors.productID && <div className="invalid-feedback d-block">{errors.productID}</div>}
                    </Form.Group>

                    <Form.Group controlId="formQuantity" className="form-group-spacing">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control
                            type="number"
                            name="quantity"
                            value={quantity}
                            onChange={this.handleChange}
                            isInvalid={!!errors.quantity}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.quantity}
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
                    <Modal.Body>Order has been successfully placed.</Modal.Body>
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

export default PlaceOrderForm;
