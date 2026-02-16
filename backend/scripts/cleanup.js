const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config({ path: './.env' });

const cleanup = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for cleanup...');

        // Find all products
        const allProducts = await Product.find({});
        console.log(`Checking ${allProducts.length} products...`);

        let removedCount = 0;
        for (const product of allProducts) {
            if (!product.seller) {
                console.log(`Removing product "${product.name}" (No seller field)`);
                await Product.findByIdAndDelete(product._id);
                removedCount++;
                continue;
            }

            const sellerExists = await User.findById(product.seller);
            if (!sellerExists) {
                console.log(`Removing product "${product.name}" (Seller ${product.seller} not found)`);
                await Product.findByIdAndDelete(product._id);
                removedCount++;
            }
        }

        console.log(`Cleanup complete. Removed ${removedCount} orphaned products.`);
        process.exit();
    } catch (error) {
        console.error('Error during cleanup:', error.message);
        process.exit(1);
    }
};

cleanup();
