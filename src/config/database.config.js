import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/multishop';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Base de datos conectada exitosamente');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
}; 