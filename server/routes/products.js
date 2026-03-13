const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

// @GET /api/products/seed - Temporary route to populate 100 products
router.get('/seed', async (req, res) => {
    try {
        const categories = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Food'];
        const brands = {
            Electronics: ['Sony', 'Samsung', 'Apple', 'Dell', 'Logitech', 'Bose'],
            Clothing: ['Nike', 'Adidas', 'Levi\'s', 'Zara', 'H&M', 'Puma'],
            Books: ['Penguin', 'HarperCollins', 'Pearson', 'Scholastic'],
            Home: ['IKEA', 'Philips', 'Samsung', 'Dyson'],
            Sports: ['Nike', 'Adidas', 'Wilson', 'Decathlon'],
            Beauty: ['L\'Oréal', 'MAC', 'Dove', 'Estée Lauder'],
            Toys: ['LEGO', 'Mattel', 'Hasbro', 'Disney'],
            Food: ['Nestlé', 'Organic Farm', 'Healthy Bites', 'Chef Special']
        };

        const productNames = {
            Electronics: ['Wireless Headphones', 'Smartwatch Pro', 'Gaming Mouse', '4K Monitor', 'Mechanical Keyboard', 'Laptop Sleeve', 'Portable SSD', 'USB-C Hub', 'Noise Cancelling Earbuds', 'Smart Home Camera'],
            Clothing: ['Cotton T-Shirt', 'Denim Jeans', 'Running Shoes', 'Hooded Sweatshirt', 'Summer Dress', 'Winter Jacket', 'Formal Shirt', 'Sport Leggings', 'Leather Belt', 'Wool Scarf'],
            Books: ['Mystery Novel', 'Science Fiction Saga', 'Financial Freedom Guide', 'Historical Biography', 'Cookbook Essentials', 'Mindset Revolution', 'Classic Poetry Collection', 'Photography Handbook', 'Tech Startup Journey', 'Art History Guide'],
            Home: ['Smart LED Bulb', 'Air Purifier', 'Memory Foam Pillow', 'Ceramic Table Lamp', 'Wireless Vacuum', 'Kitchen Knife Set', 'Wall Clock Modern', 'Essential Oil Diffuser', 'Cozy Throw Blanket', 'Storage Box Set'],
            Sports: ['Yoga Mat Pro', 'Basketball Official', 'Dumbbell Set', 'Cycling Helmet', 'Badminton Racket', 'Swimming Goggles', 'Football 2026 Edition', 'Resistance Bands', 'Hydration Bottle', 'Jump Rope Speed'],
            Beauty: ['Hydrating Serum', 'Matte Lipstick', 'Sunscreen SPF 50', 'Charcoal Face Mask', 'Coconut Hair Oil', 'Electric Face Cleanser', 'Body Butter Organic', 'Eyeliner Waterproof', 'Hand Cream Set', 'Perfume Gold'],
            Toys: ['Building Blocks Set', 'Remote Control Car', 'Educational Globe', 'Plush Teddy Bear', 'Puzzle 1000 Pieces', 'Dolls House Kit', 'Science Experiment Box', 'Board Game Night', 'Action Figure Hero', 'Drawing Tablet Fun'],
            Food: ['Organic Honey', 'Roasted Almonds', 'Dark Chocolate Bar', 'Gourmet Coffee Beans', 'Green Tea Packs', 'Gluten-Free Flour', 'Extra Virgin Olive Oil', 'Spices Variety Box', 'Whole Wheat Pasta', 'Dried Fruit Mix']
        };

        const products = [];
        for (let i = 1; i <= 100; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const brand = brands[category][Math.floor(Math.random() * brands[category].length)];
            const nameBase = productNames[category][Math.floor(Math.random() * productNames[category].length)];
            const name = `${brand} ${nameBase} ${Math.floor(Math.random() * 999)}`;
            const price = Math.floor(Math.random() * 15000) + 200;
            const discount = Math.floor(Math.random() * 50);
            const originalPrice = Math.floor(price / (1 - discount / 100));

            products.push({
                name,
                description: `Experience high-quality performance with the ${name}. Perfect for your daily needs in the ${category} category. Features premium materials from ${brand}, advanced technology, and a durable design.`,
                price,
                originalPrice: discount > 0 ? originalPrice : undefined,
                category,
                brand,
                stock: Math.floor(Math.random() * 200) + 10,
                rating: (Math.random() * 1.5 + 3.5).toFixed(1),
                numReviews: Math.floor(Math.random() * 500) + 10,
                isFeatured: Math.random() > 0.8,
                isFlashSale: Math.random() > 0.9,
                discount: discount,
                images: [`https://picsum.photos/seed/${i + 200}/500/500`],
                tags: [category.toLowerCase(), brand.toLowerCase(), 'premium', 'deal'],
                deliveryTime: ['2-4 business days', '3-5 business days', 'Fast Delivery (2 days)'][Math.floor(Math.random() * 3)],
            });
        }

        await Product.insertMany(products);
        res.json({ message: 'Successfully added 100 sample products to the database!' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

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
