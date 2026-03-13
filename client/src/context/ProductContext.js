import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [flashSale, setFlashSale] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = async (query = '') => {
        try {
            setLoading(true);
            const { data } = await API.get(`/products${query}`);
            setProducts(data.products || []);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    const fetchFeatured = async () => {
        try {
            const { data } = await API.get('/products/featured');
            setFeatured(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchFlashSale = async () => {
        try {
            const { data } = await API.get('/products/flash-sale');
            setFlashSale(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchFeatured();
        fetchFlashSale();
        fetchProducts();
    }, []);

    const getProduct = async (id) => {
        try {
            setLoading(true);
            const { data } = await API.get(`/products/${id}`);
            setLoading(false);
            return data;
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setLoading(false);
            return null;
        }
    };

    return (
        <ProductContext.Provider
            value={{ products, featured, flashSale, loading, error, fetchProducts, getProduct }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProduct = () => useContext(ProductContext);
