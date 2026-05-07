const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  color: { type: String, default: '#3B82F6' }
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);
