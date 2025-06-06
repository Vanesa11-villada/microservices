const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/festivos';
    await mongoose.connect(uri, {
      // Estas opciones ya no son necesarias si usas Mongoose v6+
    });
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
