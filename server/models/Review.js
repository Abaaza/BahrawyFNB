const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  caseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Case' },
  specialistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String,
  statements: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
