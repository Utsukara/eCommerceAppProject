import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Modal } from 'react-bootstrap';
import Select from 'react-select';
import { useNavigate } from "react-router-dom";

const PlaceOrderForm = () => {
    const [customerID, setCustomerID] = useState("");
    const [productID, setProductID] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [products, setProducts] = useState([]);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get('http://127.0.0.1:5000/products')
            .then(response => {
                const products = response.data.map(product => ({
                    value: product.id,
                    label: `${product.name} ($${product.price})`
                }));
                setProducts(products);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "customerID") setCustomerID(value);
        if (name === "quantity") setQuantity(value);
    }

    const handleSelectChange = (selectedOption) => {
        setProductID(selectedOption ? selectedOption.value : "");
    }

    const validateForm = () => {
        const errors = {};
        if (!customerID) errors.customerID = "Customer ID is required";
        if (!productID) errors.productID = "Product is required";
        if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) errors.quantity = "Quantity must be a positive number";
        return errors;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const errors = validateForm();
        setErrors(errors);
        if (Object.keys(errors).length === 0) {
            const orderData = {
                customer_id: customerID.trim(),
                product_id: productID,
                quantity: parseInt(quantity)
            };

            axios.post('http://127.0.0.1:5000/orders', orderData)
                .then(() => {
                    setShowSuccessModal(true);
                })
                .catch(error => {
                    setSubmitError(error.message);
                });
        } else {
            setSubmitError(null);
        }
    };

    const closeModal = () => {
        setShowSuccessModal(false);
        console.log("Navigating to /order-history");
        navigate('/order-history');
    }

    return (
        <Container>
            <h3>Place Order</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formCustomerID" className="form-group-spacing">
                    <Form.Label>Customer ID</Form.Label>
                    <Form.Control
                        type="text"
                        name="customerID"
                        value={customerID}
                        onChange={handleChange}
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
                        onChange={handleSelectChange}
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
                        onChange={handleChange}
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

            <Modal show={showSuccessModal} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Order has been successfully placed.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default PlaceOrderForm;
