const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ["Tablets", "Capsules", "Syrup", "Injections"] },
  stock: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  imageUrl: { type: String, required: true }, // Image URL
  description: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Medicine", MedicineSchema);
