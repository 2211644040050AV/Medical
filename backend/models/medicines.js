const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: String,
  modelNumber: String,
  brand: String,
  category: String,
  subcategory: String, 
  stock: Number,
  price: Number,
  discount: Number,
  deliveryCharge: Number,
  status: Boolean,
  description: String,
  image: String,
});

module.exports = mongoose.model("Medicine", medicineSchema);
