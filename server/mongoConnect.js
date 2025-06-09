const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

async function connectMongo() {
  if (!MONGO_URI) {
    console.warn('MONGO_URI not set; skipping MongoDB connection');
    return;
  }
  if (mongoose.connection.readyState === 1) {
    return;
  }
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

module.exports = connectMongo;
