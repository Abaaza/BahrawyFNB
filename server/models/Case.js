const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clinCheckId: String,
  photos: [String],
  files: [String],
  link: String,
  status: {
    type: String,
    enum: ['received', 'in_progress', 'report_ready'],
    default: 'received',
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Case', caseSchema);
