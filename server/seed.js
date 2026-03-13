const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
    {
        name: 'Sony WH-1000XM5 Wireless Headphones',
        description: 'Industry-leading noise canceling with Dual Noise Sensor technology. 30-hour battery life, touch sensor controls, speak-to-chat technology.',
        price: 24999,
        originalPrice: 34999,
        category: 'Electronics',
        brand: 'Sony',
        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
            'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
        ],
        stock: 50,
        rating: 4.5,
        numReviews: 1234,
        isFeatured: true,
        isFlashSale: true,
        discount: 28,
        tags: ['headphones', 'wireless', 'noise-canceling', 'sony'],
        deliveryTime: '2-3 business days',
    },
    {
        name: 'Apple iPhone 15 Pro Max 256GB',
        description: 'Titanium design, A17 Pro chip, 48MP main camera, ProRes video, USB 3 speed, and Action button.',
        price: 134900,
        originalPrice: 159900,
        category: 'Electronics',
        brand: 'Apple',
        images: [
            'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
            'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500',
        ],
        stock: 20,
        rating: 4.8,
        numReviews: 5678,
        isFeatured: true,
        isFlashSale: false,
        discount: 16,
        tags: ['iphone', 'apple', 'smartphone', '5G'],
        deliveryTime: '1-2 business days',
    },
    {
        name: 'Samsung 65" 4K QLED Smart TV',
        description: 'Quantum Dot technology, 4K resolution, Smart TV with Tizen OS, built-in Alexa, and Cinematic experience.',
        price: 89999,
        originalPrice: 120000,
        category: 'Electronics',
        brand: 'Samsung',
        images: [
            'https://images.unsplash.com/photo-1593359677879-a4bb92f4834a?w=500',
            'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500',
        ],
        stock: 15,
        rating: 4.6,
        numReviews: 892,
        isFeatured: true,
        isFlashSale: true,
        discount: 25,
        tags: ['tv', 'samsung', '4K', 'smart-tv', 'QLED'],
        deliveryTime: '3-5 business days',
    },
    {
        name: 'Nike Air Max 270 Running Shoes',
        description: 'Max cushioning meets modern design. Air Max unit in the heel for all-day comfort. Mesh upper for breathability.',
        price: 8995,
        originalPrice: 12995,
        category: 'Sports',
        brand: 'Nike',
        images: [
            'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
            'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500',
        ],
        stock: 80,
        rating: 4.4,
        numReviews: 3241,
        isFeatured: true,
        isFlashSale: true,
        discount: 30,
        tags: ['nike', 'shoes', 'running', 'air-max', 'sneakers'],
        deliveryTime: '2-4 business days',
    },
    {
        name: 'MacBook Air M2 Chip 13-inch',
        description: 'Supercharged by M2 chip. All-day battery life up to 18 hours. Fanless design, stunning liquid retina display.',
        price: 114900,
        originalPrice: 134900,
        category: 'Electronics',
        brand: 'Apple',
        images: [
            'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
            'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
        ],
        stock: 25,
        rating: 4.9,
        numReviews: 2341,
        isFeatured: true,
        isFlashSale: false,
        discount: 15,
        tags: ['macbook', 'apple', 'laptop', 'M2'],
        deliveryTime: '1-3 business days',
    },
    {
        name: 'Levi\'s Men\'s 511 Slim Fit Jeans',
        description: 'Classic slim fit jeans that sit below the waist. Slim through the seat and thigh with a narrower leg opening.',
        price: 2499,
        originalPrice: 3999,
        category: 'Clothing',
        brand: 'Levi\'s',
        images: [
            'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500',
            'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500',
        ],
        stock: 120,
        rating: 4.3,
        numReviews: 6782,
        isFeatured: false,
        isFlashSale: true,
        discount: 37,
        tags: ['jeans', 'levis', 'denim', 'men', 'slim-fit'],
        deliveryTime: '3-5 business days',
    },
    {
        name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
        description: '7-in-1 multi-use cooker: pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker & warmer.',
        price: 7999,
        originalPrice: 12999,
        category: 'Home',
        brand: 'Instant Pot',
        images: [
            'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500',
            'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500',
        ],
        stock: 45,
        rating: 4.7,
        numReviews: 9823,
        isFeatured: true,
        isFlashSale: false,
        discount: 38,
        tags: ['pressure-cooker', 'kitchen', 'instant-pot', 'appliance'],
        deliveryTime: '2-4 business days',
    },
    {
        name: 'Canon EOS R50 Mirrorless Camera',
        description: '24.2MP APS-C CMOS sensor, DIGIC X image processor, 4K 30fps video, Wi-Fi & Bluetooth connectivity.',
        price: 69995,
        originalPrice: 82995,
        category: 'Electronics',
        brand: 'Canon',
        images: [
            'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
            'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500',
        ],
        stock: 18,
        rating: 4.6,
        numReviews: 432,
        isFeatured: true,
        isFlashSale: false,
        discount: 16,
        tags: ['camera', 'canon', 'mirrorless', 'photography'],
        deliveryTime: '2-3 business days',
    },
    {
        name: 'The Alchemist by Paulo Coelho',
        description: 'A special 25th anniversary edition of the extraordinary international bestseller that has delighted millions of readers.',
        price: 299,
        originalPrice: 499,
        category: 'Books',
        brand: 'HarperCollins',
        images: [
            'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500',
            'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500',
        ],
        stock: 200,
        rating: 4.8,
        numReviews: 45231,
        isFeatured: false,
        isFlashSale: true,
        discount: 40,
        tags: ['book', 'fiction', 'motivational', 'bestseller'],
        deliveryTime: '2-4 business days',
    },
    {
        name: 'Dyson V15 Detect Cordless Vacuum',
        description: 'Laser detects invisible dust. Piezo sensor counts and sizes dust particles. Up to 60 minutes of run time.',
        price: 52900,
        originalPrice: 65900,
        category: 'Home',
        brand: 'Dyson',
        images: [
            'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
            'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=500',
        ],
        stock: 30,
        rating: 4.7,
        numReviews: 1289,
        isFeatured: true,
        isFlashSale: false,
        discount: 20,
        tags: ['vacuum', 'dyson', 'cordless', 'home-appliance'],
        deliveryTime: '3-5 business days',
    },
    {
        name: 'Adidas Ultraboost 23 Running Shoes',
        description: 'Made with a responsive BOOST midsole & Primeknit upper. Feel the energy return for a supportive, comfortable run.',
        price: 14999,
        originalPrice: 18999,
        category: 'Sports',
        brand: 'Adidas',
        images: [
            'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500',
            'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=500',
        ],
        stock: 60,
        rating: 4.5,
        numReviews: 2987,
        isFeatured: false,
        isFlashSale: true,
        discount: 21,
        tags: ['adidas', 'shoes', 'running', 'ultraboost'],
        deliveryTime: '2-4 business days',
    },
    {
        name: 'L\'Oreal Paris Revitalift Serum',
        description: 'Concentrated 2.5% pure retinol + hyaluronic acid anti-aging serum. Reduces wrinkles, firms & brightens skin.',
        price: 1299,
        originalPrice: 1999,
        category: 'Beauty',
        brand: 'L\'Oreal',
        images: [
            'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500',
            'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=500',
        ],
        stock: 100,
        rating: 4.2,
        numReviews: 8432,
        isFeatured: false,
        isFlashSale: true,
        discount: 35,
        tags: ['serum', 'skincare', 'loreal', 'anti-aging', 'beauty'],
        deliveryTime: '3-5 business days',
    },
];

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecom');
        console.log('Connected to MongoDB');

        await Product.deleteMany();
        console.log('Products cleared');

        await Product.insertMany(products);
        console.log(`✅ ${products.length} products seeded!`);

        // Create admin user
        const adminExists = await User.findOne({ email: 'admin@shophub.com' });
        if (!adminExists) {
            await User.create({
                name: 'Admin',
                email: 'admin@shophub.com',
                password: 'admin123',
                role: 'admin',
            });
            console.log('✅ Admin user created: admin@shophub.com / admin123');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding error:', err);
        process.exit(1);
    }
}

seedDB();
