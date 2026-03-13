const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

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

const generateProducts = () => {
    const products = [];
    for (let i = 1; i <= 100; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const brand = brands[category][Math.floor(Math.random() * brands[category].length)];
        const nameBase = productNames[category][Math.floor(Math.random() * productNames[category].length)];
        const name = `${brand} ${nameBase} ${Math.floor(Math.random() * 1000)}`;
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
            images: [`https://picsum.photos/seed/${i + 100}/500/500`],
            tags: [category.toLowerCase(), brand.toLowerCase(), 'premium', 'deal'],
            deliveryTime: ['2-4 business days', '3-5 business days', 'Fast Delivery (2 days)'][Math.floor(Math.random() * 3)],
        });
    }
    return products;
};

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Optional: Clear existing products
        // await Product.deleteMany({});
        // console.log('Cleared existing products');

        const products = generateProducts();
        await Product.insertMany(products);
        console.log('Successfully seeded 100 products!');
        
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seed();
