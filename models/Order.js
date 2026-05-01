const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  name: String,
  phone: String,
  items: [{ productId: String, name: String, price: Number, qty: Number }],
  total: Number,
  address: String
}, { timestamps:true });
module.exports = mongoose.model('Order', OrderSchema);