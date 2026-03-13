const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// @GET /api/reviews/product/:productId
router.get('/product/:productId', async (req, res) => {
    try {
        const reviews = await Review.find({ product: req.params.productId })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @POST /api/reviews
router.post('/', protect, async (req, res) => {
    try {
        const { product, rating, title, comment } = req.body;

        const review = await Review.create({
            user: req.user._id,
            product,
            name: req.user.name,
            rating,
            title,
            comment,
            verified: true,
        });

        // Update product rating
        const reviews = await Review.find({ product });
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
        await Product.findByIdAndUpdate(product, {
            rating: avgRating.toFixed(1),
            numReviews: reviews.length,
        });

        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @PUT /api/reviews/:id/helpful
router.put('/:id/helpful', protect, async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { $inc: { helpful: 1 } },
            { new: true }
        );
        res.json(review);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @GET /api/reviews - Get all reviews (admin)
const { admin } = require('../middleware/auth');
router.get('/', protect, admin, async (req, res) => {
    try {
        const reviews = await Review.find({})
            .populate('user', 'name email')
            .populate('product', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @DELETE /api/reviews/:id - Delete review (admin)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });
        // Recalculate product rating
        const reviews = await Review.find({ product: review.product });
        if (reviews.length > 0) {
            const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
            await Product.findByIdAndUpdate(review.product, {
                rating: avgRating.toFixed(1),
                numReviews: reviews.length,
            });
        } else {
            await Product.findByIdAndUpdate(review.product, { rating: 0, numReviews: 0 });
        }
        res.json({ message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
