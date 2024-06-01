import React, { useRef, useState } from 'react';
import axios from 'axios';

const ProductForm = ({ onProductAdd }) => {
    const nameRef = useRef(null);
    const priceRef = useRef(null);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const errors = {};
        const name = nameRef.current.value;
        const price = priceRef.current.value;
        if (!name) errors.name = "Name is required";
        if (!price || price <= 0) errors.price = "Price is required and must be a positive number";
        return errors;
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length === 0) {
            const name = nameRef.current.value;
            const price = parseFloat(priceRef.current.value);
            const productData = { name, price };
            
            axios.post('http://127.0.0.1:5000/products', productData)
                .then(response => {
                    console.log('Product successfully added:', response.data);
                    onProductAdd(response.data);
                })
                .catch(error => {
                    console.error('Error adding product:', error.response ? error.response.data : error.message);
                });

            // Clear input fields after submission
            nameRef.current.value = '';
            priceRef.current.value = '';
        } else {
            setErrors(errors);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Add/Edit Product</h3>
            <label>
                Name:
                <input type="text" ref={nameRef} />
                {errors.name && <div style={{ color: 'red' }}>{errors.name}</div>}
            </label>
            <br />
            <label>
                Price:
                <input type="number" ref={priceRef} />
                {errors.price && <div style={{ color: 'red' }}>{errors.price}</div>}
            </label>
            <br />
            <button type="submit">Submit</button>
        </form>
    );
}

export default ProductForm;
