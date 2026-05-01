const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  price: { type: Number, required: true },
  img: String,
  desc: String,
  stock: { type: Number, default: 0 }
}, { timestamps:true });
module.exports = mongoose.model('Product', ProductSchema);