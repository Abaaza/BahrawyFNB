const mongoose = require('mongoose');

const clinicalStatementSchema = new mongoose.Schema({
  key: { type: String, required: true },
  text: { type: String, required: true },
});

module.exports = mongoose.model('ClinicalStatement', clinicalStatementSchema);
