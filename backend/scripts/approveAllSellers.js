const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const approveAllSellers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const result = await User.updateMany(
            { roles: 'seller' },
            { $set: { sellerStatus: 'approved' } }
        );
        console.log(`Updated ${result.modifiedCount} sellers to approved status.`);

        // Also make sure admin is a seller and approved
        const admin = await User.findOne({ email: 'admin@emporium.com' });
        if (admin) {
            if (!admin.roles.includes('seller')) {
                admin.roles.push('seller');
            }
            admin.sellerStatus = 'approved';
            await admin.save();
            console.log('Admin user verified as approved seller.');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

approveAllSellers();
