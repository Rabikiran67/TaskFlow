const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {

    // This allows the calling function to handle it.
    console.error(`Database Connection Error: ${error.message}`);
    throw error; 
  }
};

module.exports = connectDB;