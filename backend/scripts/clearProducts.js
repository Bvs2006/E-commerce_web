const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config({ path: './.env' });

const clearProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected to clear products...');

        const deleted = await Product.deleteMany({});
        console.log(`Successfully deleted ${deleted.deletedCount} products.`);

        process.exit();
    } catch (error) {
        console.error('Error clearing products:', error);
        process.exit(1);
    }
};

clearProducts();
