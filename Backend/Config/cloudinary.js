import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();


const connectClodinary = async () => {

      // Configuration
      cloudinary.config({ 
        cloud_name: process.env.cloudinary_NAME, 
        api_key: process.env.cloudinary_API_KEY, 
        api_secret: process.env.cloudinary_SECRET_KEY  
    });

}

export default connectClodinary;