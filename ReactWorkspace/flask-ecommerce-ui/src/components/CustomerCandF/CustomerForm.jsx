import axios from "axios";
import React, { Component } from "react";
import { Form, Button, Container, Alert, Modal } from 'react-bootstrap';

class CustomerForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: "",
            email: "",
            phone: "",
            errors: {},
            submitError: null,
            selectedCustomerID: null,
            showSuccessModal: false
        };
    }

    componentDidMount() {
        const { id } = this.props.params;
        if (id) {
            this.fetchCustomerData(id);
        }
    }

    componentDidUpdate(prevProps) {
        const { id } = this.props.params;
        if (prevProps.params.id !== id) {
            if (id) {
                this.fetchCustomerData(id);
            } else {
                this.clearForm();
            }
        }
    }

    fetchCustomerData = (id) => {
        axios.get(`http://127.0.0.1:5000/customers/${id}`)
            .then(response => {
                const { name, email, phone } = response.data;
                this.setState({
                    name,
                    email,
                    phone,
                    selectedCustomerID: id
                });
            })
            .catch(error => {
                console.error('Error fetching customer:', error);
            });
    }

    clearForm = () => {
        this.setState({
            name: "",
            email: "",
            phone: "",
            errors: {},
            submitError: null,
            selectedCustomerID: null
        });
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    validateForm = () => {
        const { name, email, phone } = this.state;
        const errors = {};
        if (!name) errors.name = "Name is required";
        if (!email) errors.email = "Email is required";
        if (!phone) errors.phone = "Phone is required";
        return errors;
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const errors = this.validateForm();
        this.setState({ errors });
        if (Object.keys(errors).length === 0) {
            const customerData = {
                name: this.state.name.trim(),
                email: this.state.email.trim(),
                phone: this.state.phone.trim()
            };
            const apiURL = this.state.selectedCustomerID ?
                `http://127.0.0.1:5000/customers/${this.state.selectedCustomerID}` :
                'http://127.0.0.1:5000/customers';

            const httpMethod = this.state.selectedCustomerID ? axios.put : axios.post;

            httpMethod(apiURL, customerData)
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
            email: "",
            phone: "",
            errors: {},
            submitError: null,
            selectedCustomerID: null
        });
        this.props.navigate("/customers");
    }

    render() {
        const { name, email, phone, errors, submitError, showSuccessModal } = this.state;
        return (
            <Container>
                <h3>{this.state.selectedCustomerID ? "Edit Customer" : "Add Customer"}</h3>
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

                    <Form.Group controlId="formEmail" className="form-group-spacing">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={email}
                            onChange={this.handleChange}
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group controlId="formPhone" className="form-group-spacing">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={phone}
                            onChange={this.handleChange}
                            isInvalid={!!errors.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.phone}
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
                    <Modal.Body>Customer information has been successfully {this.state.selectedCustomerID ? "updated" : "added"}.</Modal.Body>
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

export default CustomerForm;
