const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect } = require('../middleware/auth');

// @POST /api/payment/create-intent
router.post('/create-intent', protect, async (req, res) => {
    try {
        const { amount, currency = 'inr' } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // in paise
            currency,
            metadata: { userId: req.user._id.toString() },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @POST /api/payment/cod - Cash on Delivery
router.post('/cod', protect, async (req, res) => {
    try {
        res.json({ success: true, message: 'Cash on Delivery order placed successfully', method: 'cod' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
