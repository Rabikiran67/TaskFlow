const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // With Mongoose v7+, these options are the default and no longer needed.
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    throw error;
  }
};

module.exports = connectDB;