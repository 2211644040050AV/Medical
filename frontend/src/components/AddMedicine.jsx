import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormImg from "./../assets/form_img.jpg";

const AddMedicine = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    expiryDate: "",
    description: "",
  });

  const [medicineImage, setMedicineImage] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedicineImage(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Medicine Added:", formData);
    alert("Medicine added successfully!");
    navigate("/");
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left Image Section */}
        <div className="col-md-6">
          <img src={FormImg} alt="Form Background" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        {/* Right Form Section */}
        <div className="col-md-6 container-fluid">
          <h2 className="py-3 mt-2 text-white text-center bg-success">Add New Medicine</h2>

          <form onSubmit={handleSubmit} className="lbl mt-3 mb-5">
            {/* Medicine Name */}
            <div className="mb-3">
              <label className="form-label">Medicine Name</label>
              <input type="text" placeholder="Enter Medicine Name" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            {/* Category */}
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select className="form-control" name="category" value={formData.category} onChange={handleChange} required>
                <option value="">Select Category</option>
                <option>Tablets</option>
                <option>Capsules</option>
                <option>Syrup</option>
                <option>Injections</option>
              </select>
            </div>

            {/* Stock */}
            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <input type="number" placeholder="Enter Quantity" className="form-control" name="stock" value={formData.stock} onChange={handleChange} required />
            </div>

            {/* Price */}
            <div className="mb-3">
              <label className="form-label">Price</label>
              <input type="number" placeholder="Enter Price" className="form-control" name="price" value={formData.price} onChange={handleChange} required />
            </div>

            {/* Medicine Image */}
            <div className="mb-3">
              <label className="form-label">Medicine Image</label>
              <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
              {medicineImage && (
                <img src={medicineImage} alt="Medicine Preview" className="mt-3" style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px" }} />
              )}
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" name="description" rows="3" value={formData.description} onChange={handleChange}></textarea>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="d-flex">
              <button type="submit" className="btn btn-primary">Save Medicine</button>
              <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate("/")}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMedicine;
