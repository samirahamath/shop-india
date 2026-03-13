const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// @GET /api/products  - Get all products with filters
router.get('/', async (req, res) => {
    try {
        const { category, search, sort, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
        let query = {};

        if (category && category !== 'All') query.category = category;
        if (search) query.$text = { $search: search };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let sortOption = {};
        if (sort === 'price-asc') sortOption.price = 1;
        else if (sort === 'price-desc') sortOption.price = -1;
        else if (sort === 'rating') sortOption.rating = -1;
        else if (sort === 'newest') sortOption.createdAt = -1;
        else sortOption.isFeatured = -1;

        const skip = (page - 1) * limit;
        const total = await Product.countDocuments(query);
        const products = await Product.find(query).sort(sortOption).skip(skip).limit(Number(limit));

        res.json({ products, total, pages: Math.ceil(total / limit), page: Number(page) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/products/featured
router.get('/featured', async (req, res) => {
    try {
        const products = await Product.find({ isFeatured: true }).limit(8);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/products/flash-sale
router.get('/flash-sale', async (req, res) => {
    try {
        const products = await Product.find({ isFlashSale: true }).limit(8);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @POST /api/products (admin only) - seed/create
router.post('/', protect, admin, async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @PUT /api/products/:id (admin only)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @DELETE /api/products/:id (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
