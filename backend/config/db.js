const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MongoDB Connection Error: MONGODB_URI is not defined in environment');
    console.error('Make sure you have a `.env` file in the backend root or set the variable before starting the server.');
    process.exit(1);
  }

  try {
    console.log('Attempting to connect to MongoDB using', uri);
    const conn = await mongoose.connect(uri, {
      // use the new url parser and unified topology (defaults in mongoose 6+)
      // you can add additional options here if needed
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
