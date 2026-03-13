const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/users', require('./routes/users'));
app.use('/api/settings', require('./routes/settings'));

// Health check
app.get('/', (req, res) => {
    res.json({
        status: '✅ ShopHub API is running',
        mongodb: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected',
        endpoints: {
            products: '/api/products',
            auth: '/api/auth',
            orders: '/api/orders',
            reviews: '/api/reviews',
            payment: '/api/payment',
        }
    });
});

// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecom')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch((err) => console.error('❌ MongoDB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
