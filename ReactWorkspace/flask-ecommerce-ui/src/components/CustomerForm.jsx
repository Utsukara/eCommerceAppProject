import axios from "axios";
import React, { Component } from "react";

// Controlled Component
// When React (via State) controls the value of a form element.
// Useful when you need to validate the form data before submitting it.

class CustomerForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: "",
            email: "",
            phone: "",
            errors: {},
            submitError: null
        };
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
            console.log('Submitted customer:', this.state);

            const customerData = {
                name: this.state.name.trim(),
                email: this.state.email.trim(),
                phone: this.state.phone.trim()
            };

            axios.post('http://127.0.0.1:5000/customers', customerData)
                .then(response => {
                    console.log('Data successfully submitted:', response.data);
                    this.setState({ name: "", email: "", phone: "", errors: {}, submitError: null });
                })
                .catch(error => {
                    console.error('Error submitting form:', error);
                    this.setState({ submitError: 'Error submitting form' });
                });
        }
    };

    render() {
        const { name, email, phone, errors, submitError } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <h3>Add/Edit Customer</h3>
                <label>
                    Name:
                    <input type="text" name="name" value={name} onChange={this.handleChange} />
                    {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                </label>
                <br />
                <label>
                    Email:
                    <input type="text" name="email" value={email} onChange={this.handleChange} />
                    {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                </label>
                <br />
                <label>
                    Phone:
                    <input type="text" name="phone" value={phone} onChange={this.handleChange} />
                    {errors.phone && <div style={{ color: 'red' }}>{errors.phone}</div>}
                </label>
                <br />
                {submitError && <div style={{ color: 'red' }}>{submitError}</div>}
                <button type="submit">Submit</button>
            </form>
        );
    }
}

export default CustomerForm;
