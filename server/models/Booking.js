const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  dentistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  datetime: { type: Date, required: true },
});

module.exports = mongoose.model('Booking', bookingSchema);
