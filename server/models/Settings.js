const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
    {
        storeName:           { type: String, default: 'ShopHub' },
        tagline:             { type: String, default: 'Your one-stop shop for everything' },
        logoText:            { type: String, default: 'ShopHub' },
        logoAccentColor:     { type: String, default: '#FF9900' },
        supportEmail:        { type: String, default: 'support@shophub.com' },
        supportPhone:        { type: String, default: '' },
        address:             { type: String, default: '' },
        footerText:          { type: String, default: '© 2026 ShopHub. All rights reserved.' },
        stripePublishableKey:{ type: String, default: '' },
        socialFacebook:      { type: String, default: '' },
        socialTwitter:       { type: String, default: '' },
        socialInstagram:     { type: String, default: '' },
        freeShippingAbove:   { type: Number, default: 499 },
        currency:            { type: String, default: 'INR' },
        currencySymbol:      { type: String, default: '₹' },
        maintenanceMode:     { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Only ever one settings document
settingsSchema.statics.getSettings = async function () {
    let settings = await this.findOne();
    if (!settings) settings = await this.create({});
    return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
