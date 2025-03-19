import mongoose from "mongoose";
import dotenv from 'dotenv';


dotenv.config();

const data = process.env.MONGODB_LINK;

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(data, {
        useNewUrlParser: true,
      });
      console.log(`MongoDB Connected: {conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }

export default connectDB;
