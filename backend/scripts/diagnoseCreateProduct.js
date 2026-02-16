const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');
const cloudinary = require('../utils/cloudinary');

dotenv.config();

const testCreateProduct = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Find a seller to use for the test
        const seller = await User.findOne({ roles: 'seller', sellerStatus: 'approved' });
        if (!seller) {
            console.log('No approved seller found in DB');
            process.exit(1);
        }
        console.log(`Using seller: ${seller.name} (${seller._id})`);

        const mockBody = {
            name: 'Test Diagnostic Product',
            description: 'A test product to diagnose creation errors',
            price: 100,
            category: 'Fashion',
            stock: 10,
            images: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==']
        };

        console.log('Starting Cloudinary upload...');
        const uploadedImages = [];
        for (const image of mockBody.images) {
            const result = await cloudinary.uploader.upload(image, {
                folder: 'products_test',
            });
            uploadedImages.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }
        console.log('Cloudinary upload successful');

        console.log('Creating product in DB...');
        const product = await Product.create({
            ...mockBody,
            images: uploadedImages,
            seller: seller._id
        });

        console.log('Success! Product created:', product._id);

        // Clean up
        await Product.findByIdAndDelete(product._id);
        console.log('Test product cleaned up');

        process.exit(0);
    } catch (error) {
        console.error('DIAGNOSTIC FAILURE:');
        console.error(error);
        process.exit(1);
    }
};

testCreateProduct();
