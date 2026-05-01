const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  name: String,
  phone: String,
  message: String
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
