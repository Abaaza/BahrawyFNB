const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  photos: [String]
});

module.exports = mongoose.model('Project', projectSchema);
