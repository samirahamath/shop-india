import React, { createContext, useState, useContext } from 'react';
import API from '../api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('userInfo');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const { data } = await API.post('/auth/login', { email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Login Successful');
            setLoading(false);
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
            setLoading(false);
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            setLoading(true);
            const { data } = await API.post('/auth/register', { name, email, password });
            setUser(data);
            localStorage.setItem('userInfo', JSON.stringify(data));
            toast.success('Registration Successful');
            setLoading(false);
            return true;
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
            setLoading(false);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('userInfo');
        toast.success('Logged out');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
