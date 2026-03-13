const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');
const { protect, admin } = require('../middleware/auth');

// @GET /api/settings — public (for store name, branding, etc.)
router.get('/', async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        // Never expose stripePublishableKey to non-admins unless they ask
        const pub = settings.toObject();
        delete pub.stripePublishableKey;
        res.json(pub);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/settings/admin — full settings including keys (admin only)
router.get('/admin', protect, admin, async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        // Return publishable key + env info
        const data = settings.toObject();
        data.stripePublishableKeyEnv = process.env.STRIPE_PUBLISHABLE_KEY || '';
        data.stripeSecretKeyMasked   = process.env.STRIPE_SECRET_KEY
            ? 'sk_' + process.env.STRIPE_SECRET_KEY.slice(3, 7) + '••••••••••••••••••••'
            : '';
        data.jwtSecretMasked         = process.env.JWT_SECRET
            ? process.env.JWT_SECRET.slice(0, 4) + '••••••••••••'
            : '';
        data.mongoUri                = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecom';
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @PUT /api/settings — admin only
router.put('/', protect, admin, async (req, res) => {
    try {
        const allowed = [
            'storeName','tagline','logoText','logoAccentColor',
            'supportEmail','supportPhone','address','footerText',
            'stripePublishableKey','socialFacebook','socialTwitter','socialInstagram',
            'freeShippingAbove','currency','currencySymbol','maintenanceMode',
        ];
        const updates = {};
        allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

        let settings = await Settings.findOne();
        if (!settings) settings = await Settings.create(updates);
        else Object.assign(settings, updates);
        await settings.save();
        res.json(settings);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
