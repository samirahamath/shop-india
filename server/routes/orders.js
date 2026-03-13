const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');

// @POST /api/orders - Create order
router.post('/', protect, async (req, res) => {
    try {
        const {
            orderItems, shippingAddress, paymentMethod,
            itemsPrice, shippingPrice, taxPrice, totalPrice,
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const estimatedDelivery = new Date();
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

        const order = await Order.create({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            estimatedDelivery,
            deliveryTracking: [
                {
                    status: 'Pending',
                    description: 'Order placed successfully',
                    location: 'Online',
                    timestamp: new Date(),
                },
            ],
        });

        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/orders/myorders - Get logged in user's orders
router.get('/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/orders/:id - Get specific order
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        // Only owner or admin can view
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @PUT /api/orders/:id/pay - Mark as paid
router.put('/:id/pay', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = req.body;
        order.orderStatus = 'Confirmed';
        order.deliveryTracking.push({
            status: 'Confirmed',
            description: 'Payment confirmed. Your order is being processed.',
            location: 'Warehouse',
            timestamp: new Date(),
        });

        const updated = await order.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @PUT /api/orders/:id/status - Update delivery status (admin)
router.put('/:id/status', protect, admin, async (req, res) => {
    try {
        const { status, location, description } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.orderStatus = status;
        order.deliveryTracking.push({
            status,
            description: description || `Order status updated to ${status}`,
            location: location || 'Hub',
            timestamp: new Date(),
        });

        if (status === 'Delivered') {
            order.deliveredAt = Date.now();
        }

        const updated = await order.save();
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/orders - Get all orders (admin)
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
