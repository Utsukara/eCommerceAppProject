import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import CustomerList from './components/CustomerList';
import NavBar from './components/NavBar';
import CustomerFormWrapper from './components/CustomerFormWrapper';
import NotFound from './components/NotFound';
import HomePage from './components/HomePage';
import PlaceOrderForm from './components/PlaceOrderForm';
import OrderDetailsWrapper from './components/OrderDetails';
import OrderHistory from './components/OrderHistory';
import ProductList from './components/ProductList';
import ProductFormWrapper from './components/ProductFormWrapper';
import './AppStyles.css';

function App() {
    const navigate = useNavigate();

    const handleCustomerSelect = (id) => {
        navigate(`/edit-customer/${id}`);
    };

    const handleUpdateCustomerList = () => {
        navigate('/customers');
    };

    const handleProductSelect = (id) => {
        navigate(`/edit-product/${id}`);
    };

    const handleUpdateProductList = () => {
        navigate('/products');
    };

    return (
        <div className="app-container">
            <NavBar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/add-customer" element={<CustomerFormWrapper onUpdateCustomerList={handleUpdateCustomerList} />} />
                <Route path="/edit-customer/:id" element={<CustomerFormWrapper onUpdateCustomerList={handleUpdateCustomerList} />} />
                <Route path="/customers" element={<CustomerList onCustomerSelect={handleCustomerSelect} />} />
                <Route path="/add-product" element={<ProductFormWrapper onUpdateProductList={handleUpdateProductList} />} />
                <Route path="/edit-product/:id" element={<ProductFormWrapper onUpdateProductList={handleUpdateProductList} />} />
                <Route path="/products" element={<ProductList onProductSelect={handleProductSelect} />} />
                <Route path="/place-order" element={<PlaceOrderForm />} />
                <Route path="/order-details/:id" element={<OrderDetailsWrapper />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
