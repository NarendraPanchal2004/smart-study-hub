const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  senderAvatar: { type: String },
  text: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'file', 'call'], default: 'text' },
  fileUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
