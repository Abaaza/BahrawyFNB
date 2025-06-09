const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  email: { type: String, unique: true, sparse: true },
  password: String,
  passwordHash: String,
  role: { type: String, enum: ['dentist', 'specialist', 'admin'], required: true }
});

module.exports = mongoose.model('User', userSchema);
