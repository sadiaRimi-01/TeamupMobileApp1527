const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/teamup";
    const conn = await mongoose.connect(connUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not crash server in dev mode if MongoDB is not locally running yet
  }
};

module.exports = connectDB;

