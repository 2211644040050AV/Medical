const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  status: { type: Boolean, default: true },
  image: { type: String, required: true },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Medicine", medicineSchema);
