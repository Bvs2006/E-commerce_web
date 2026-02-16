const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({ roles: 'seller' });
        console.log('Sellers found:', users.length);
        users.forEach(u => {
            console.log(`Name: ${u.name}, Status: ${u.sellerStatus}, Roles: ${u.roles}`);
        });
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkUser();
