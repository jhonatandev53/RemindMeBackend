import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' Base de datos conectada con éxito a MongoDB Atlas');
  } catch (error) {
    console.error(' Error conectando a la BD:', error.message);
    process.exit(1);
  }
};