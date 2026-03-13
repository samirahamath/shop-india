const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @GET /api/users/profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password').populate('wishlist');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @PUT /api/users/profile
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, phone, address },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @PUT /api/users/wishlist/:productId - Toggle wishlist
router.put('/wishlist/:productId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const productId = req.params.productId;
        const idx = user.wishlist.findIndex((id) => id.toString() === productId);

        if (idx === -1) user.wishlist.push(productId);
        else user.wishlist.splice(idx, 1);

        await user.save();
        res.json({ wishlist: user.wishlist });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const { admin } = require('../middleware/auth');

// @GET /api/users - Get all users (admin)
router.get('/', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @PUT /api/users/:id - Update user role (admin)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const { role, name } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role, name },
            { new: true }
        ).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @DELETE /api/users/:id - Delete user (admin)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
