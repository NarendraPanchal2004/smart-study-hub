const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  class: { type: String, required: true },
  subject: { type: String, required: true },
  board: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
