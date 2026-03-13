const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        originalPrice: { type: Number },
        category: {
            type: String,
            required: true,
            enum: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Food'],
        },
        brand: { type: String, default: '' },
        images: [{ type: String }],
        stock: { type: Number, required: true, default: 0 },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        numReviews: { type: Number, default: 0 },
        isFeatured: { type: Boolean, default: false },
        isFlashSale: { type: Boolean, default: false },
        discount: { type: Number, default: 0 },
        tags: [String],
        seller: { type: String, default: 'ShopHub Store' },
        deliveryTime: { type: String, default: '3-5 business days' },
    },
    { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
