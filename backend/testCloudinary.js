const cloudinary = require('./utils/cloudinary');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const testCloudinary = async () => {
    try {
        console.log('Testing Cloudinary with settings:');
        console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
        console.log('API Key:', process.env.CLOUDINARY_API_KEY);

        // Attempt to upload a small transparent pixel
        const pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

        const result = await cloudinary.uploader.upload(pixel, {
            folder: 'test_uploads'
        });

        console.log('Success! Cloudinary upload works.');
        console.log('Public ID:', result.public_id);
        console.log('URL:', result.secure_url);
        process.exit(0);
    } catch (error) {
        console.error('Cloudinary Test Failed:');
        console.error(error);
        process.exit(1);
    }
};

testCloudinary();
