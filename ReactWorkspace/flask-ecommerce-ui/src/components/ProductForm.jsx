import axios from "axios";
import React, { Component } from "react";

// Controlled Component
class ProductForm extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name: "",
            price: "",
            errors: {},
            submitError: null,
            selectedProductID: null
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.productID !== this.props.productID) {
            this.setState({ selectedProductID: this.props.productID });

            if (this.props.productID) {
                axios.get(`http://127.0.0.1:5000/products/${this.props.productID}`)
                    .then(response => {
                        const { name, price } = response.data;
                        this.setState({ 
                            name: name, 
                            price: price.toString()  // Ensure price is a string for the input field
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching product:', error);
                    });
            } else {
                this.setState({ name: "", price: "" });
            }
        }
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
            console.log('Submitted product:', this.state);

            const productData = {
                name: this.state.name.trim(),
                price: parseFloat(this.state.price)
            };
            const apiURL = this.state.selectedProductID ?
                `http://127.0.0.1:5000/products/${this.state.selectedProductID}` :
                'http://127.0.0.1:5000/products';

            const httpMethod = this.state.selectedProductID ? axios.put : axios.post;

            httpMethod(apiURL, productData)
                .then(response => {
                    this.props.onUpdateProductList();
                    this.setState({ 
                        name: "", 
                        price: "", 
                        errors: {}, 
                        submitError: null 
                    });
                })
                .catch(error => {
                    console.error('Error saving product:', error);
                    this.setState({ submitError: "Error submitting form" });
                });
        } else {
            this.setState({ submitError: null });
        }
    };

    render() {
        const { name, price, errors, submitError } = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <h3>Add/Edit Product</h3>
                <label>
                    Name:
                    <input type="text" name="name" value={name} onChange={this.handleChange} />
                    {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
                </label>
                <br />
                <label>
                    Price:
                    <input type="number" step="0.01" name="price" value={price} onChange={this.handleChange} />
                    {errors.price && <div style={{ color: 'red' }}>{errors.price}</div>}
                </label>
                <br />
                {submitError && <div style={{ color: 'red' }}>{submitError}</div>}
                <button type="submit">Submit</button>
            </form>
        );
    }
}

export default ProductForm;