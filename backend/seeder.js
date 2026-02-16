const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const bcrypt = require('bcryptjs');

dotenv.config();

const products = [
    {
        name: 'iPhone 15 Pro',
        description: 'The latest iPhone with titanium design, A17 Pro chip, and advanced camera system.',
        price: 134900,
        category: 'Electronics',
        images: [{ url: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800&auto=format&fit=crop&q=60' }],
        stock: 50,
        rating: 4.8,
        numReviews: 124
    },
    {
        name: 'MacBook Air M2',
        description: 'Supercharged by M2 chip. Strikingly thin design and up to 18 hours of battery life.',
        price: 114900,
        category: 'Electronics',
        images: [{ url: 'https://images.unsplash.com/photo-1611186871348-b1ec696e5237?w=800&auto=format&fit=crop&q=60' }],
        stock: 30,
        rating: 4.9,
        numReviews: 89
    },
    {
        name: 'Sony WH-1000XM5',
        description: 'Industry-leading noise canceling with 8 microphones and Auto NC Optimizer.',
        price: 26990,
        category: 'Electronics',
        images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60' }],
        stock: 100,
        rating: 4.7,
        numReviews: 256
    },
    {
        name: 'Leather Jacket',
        description: 'Genuine leather jacket with premium stitching and timeless style.',
        price: 4999,
        category: 'Fashion',
        images: [{ url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=60' }],
        stock: 40,
        rating: 4.5,
        numReviews: 67
    },
    {
        name: 'Coffee Maker',
        description: 'Programmable coffee maker with thermal carafe and drip-free pouring.',
        price: 3499,
        category: 'Home & Kitchen',
        images: [{ url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=60' }],
        stock: 25,
        rating: 4.3,
        numReviews: 45
    },
    {
        name: 'Yoga Mat',
        description: 'Extra thick non-slip yoga mat for all types of yoga and floor exercises.',
        price: 999,
        category: 'Sports',
        images: [{ url: 'https://images.unsplash.com/photo-1592437172054-080cde236357?w=800&auto=format&fit=crop&q=60' }],
        stock: 150,
        rating: 4.6,
        numReviews: 112
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        console.log('Existing data cleared.');

        // Create Admin/Seller
        const admin = await User.create({
            name: 'Admin User',
            email: 'admin@emporium.com',
            password: 'admin123',
            roles: ['admin', 'seller'],
            sellerStatus: 'approved',
            shopName: 'Emporium Main Store',
            shopDescription: 'Official store for Emporium products.'
        });
        console.log('Admin user created.');

        // Add seller ID to products
        const sampleProducts = products.map(product => ({
            ...product,
            seller: admin._id
        }));

        await Product.insertMany(sampleProducts);
        console.log('Sample products seeded.');

        console.log('Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error.message);
        process.exit(1);
    }
};

seedData();
