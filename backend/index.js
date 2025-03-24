const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const Medicine = require("./models/medicines");

const app = express();
const port = 3000;

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
  .catch((err) => console.log("❌ DB Connection Error:", err));

// ✅ Multer Storage (Image Upload)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// ✅ Create New Medicine (INSERT)
app.post("/api/medicines", upload.single("image"), async (req, res) => {
  try {
    const { name, category, stock, price, discount, status, description } = req.body;

    const medicine = new Medicine({
      name,
      category,
      stock,
      price,
      discount: discount || 0,
      status: status === "true" || status === true,
      description,
      image: req.file ? `/uploads/${req.file.filename}` : null, // Store image path
    });

    await medicine.save();
    res.status(201).json({ message: "✅ Medicine added successfully!", medicine });
  } catch (error) {
    res.status(500).json({ message: "⚠️ Internal Server Error", error });
  }
});

// ✅ Update Existing Medicine (UPDATE)
app.put("/api/medicines/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, stock, price, discount, status, description } = req.body;

    const medicine = await Medicine.findById(id);
    if (!medicine) return res.status(404).json({ message: "⚠️ Medicine not found" });

    let updateData = {
      name,
      category,
      stock,
      price,
      discount,
      status: status === "true" || status === true,
      description,
    };

    // ✅ Handle Image Update
    if (req.file) {
      // Remove old image if exists
      if (medicine.image) {
        const oldImagePath = path.join(__dirname, medicine.image);
        try {
          await fs.unlink(oldImagePath);
        } catch (err) {
          console.warn("⚠️ Error deleting old image:", err);
        }
      }
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedMedicine = await Medicine.findByIdAndUpdate(id, updateData, { new: true });

    res.json({ message: "✅ Medicine updated successfully!", medicine: updatedMedicine });
  } catch (error) {
    res.status(500).json({ message: "⚠️ Internal Server Error", error });
  }
});

// ✅ Get Single Medicine (For Update Form)
app.get("/api/medicines/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) return res.status(404).json({ message: "⚠️ Medicine not found" });
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: "⚠️ Error fetching medicine", error });
  }
});

// ✅ Get All Medicines
app.get("/api/medicines", async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: "⚠️ Error fetching medicines", error });
  }
});

// ✅ Delete Medicine
app.delete("/api/medicines/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const medicine = await Medicine.findById(id);

    if (!medicine) return res.status(404).json({ message: "⚠️ Medicine not found" });

    // Remove image if exists
    if (medicine.image) {
      const imagePath = path.join(__dirname, medicine.image);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.warn("⚠️ Error deleting image:", err);
      }
    }

    await Medicine.findByIdAndDelete(id);
    res.json({ message: "✅ Medicine deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "⚠️ Error deleting medicine", error });
  }
});

app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
