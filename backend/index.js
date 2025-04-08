const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const Medicine = require("./models/medicines"); // ✅ Make sure the schema has 'subcategory'

const app = express();
const port = 3000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images

// ✅ Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/medical", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// ✅ Multer Storage for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// ✅ Create Medicine
app.post("/api/medicines", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      modelNumber,
      brand,
      category,
      subcategory, // ✅ Match frontend field name
      stock,
      price,
      discount,
      deliveryCharge,
      status,
      description,
    } = req.body;

    const medicine = new Medicine({
      name,
      modelNumber,
      brand,
      category,
      subcategory,
      stock: parseInt(stock) || 0,
      price: parseFloat(price) || 0,
      discount: parseFloat(discount) || 0,
      deliveryCharge: parseFloat(deliveryCharge) || 0,
      status: status === "true" || status === true,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    await medicine.save();
    res.status(201).json({ message: "✅ Medicine added successfully!", medicine });
  } catch (error) {
    console.error("❌ Error while adding medicine:", error);
    res.status(500).json({ message: "⚠️ Internal Server Error", error });
  }
});

// ✅ Update Medicine
app.put("/api/medicines/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      modelNumber,
      brand,
      category,
      subcategory,
      stock,
      price,
      discount,
      deliveryCharge,
      status,
      description,
    } = req.body;

    const medicine = await Medicine.findById(id);
    if (!medicine) return res.status(404).json({ message: "⚠️ Medicine not found" });

    const updateData = {
      name,
      modelNumber,
      brand,
      category,
      subcategory,
      stock: parseInt(stock) || 0,
      price: parseFloat(price) || 0,
      discount: parseFloat(discount) || 0,
      deliveryCharge: parseFloat(deliveryCharge) || 0,
      status: status === "true" || status === true,
      description,
    };

    if (req.file) {
      if (medicine.image) {
        const oldImagePath = path.join(__dirname, medicine.image);
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.warn("⚠️ Failed to delete old image:", err);
        }
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedMedicine = await Medicine.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ message: "✅ Medicine updated successfully!", medicine: updatedMedicine });
  } catch (error) {
    console.error("❌ Error updating medicine:", error);
    res.status(500).json({ message: "⚠️ Internal Server Error", error });
  }
});

// ✅ Get All Medicines
app.get("/api/medicines", async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    console.error("❌ Error fetching medicines:", error);
    res.status(500).json({ message: "⚠️ Internal Server Error", error });
  }
});

// ✅ Get Single Medicine
app.get("/api/medicines/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "⚠️ Medicine not found" });
    res.json(medicine);
  } catch (error) {
    console.error("❌ Error fetching medicine:", error);
    res.status(500).json({ message: "⚠️ Internal Server Error", error });
  }
});

// ✅ Delete Medicine
app.delete("/api/medicines/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "⚠️ Medicine not found" });

    if (medicine.image) {
      const imagePath = path.join(__dirname, medicine.image);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.warn("⚠️ Error deleting image:", err);
      }
    }

    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: "✅ Medicine deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting medicine:", error);
    res.status(500).json({ message: "⚠️ Internal Server Error", error });
  }
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Something went wrong" });
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
