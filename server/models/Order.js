const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        orderItems: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
                name: String,
                image: String,
                price: Number,
                quantity: { type: Number, required: true, min: 1 },
            },
        ],
        shippingAddress: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true },
            country: { type: String, default: 'India' },
            phone: { type: String, required: true },
        },
        paymentMethod: { type: String, required: true, enum: ['stripe', 'cod', 'razorpay'] },
        paymentResult: {
            id: String,
            status: String,
            updateTime: String,
            emailAddress: String,
        },
        itemsPrice: { type: Number, required: true },
        shippingPrice: { type: Number, required: true },
        taxPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        orderStatus: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'],
            default: 'Pending',
        },
        deliveryTracking: [
            {
                status: String,
                timestamp: { type: Date, default: Date.now },
                location: String,
                description: String,
            },
        ],
        estimatedDelivery: { type: Date },
        deliveredAt: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
