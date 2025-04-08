import { useState } from "react";
import { useNavigate } from "react-router-dom";
import formImg from "../assets/form_img.jpg";

export default function AddMedicine() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    modelNumber: "",
    brand: "",
    category: "",
    subcategory: "",
    stock: "",
    price: "",
    discount: "",
    deliveryCharge: "",
    status: false,
    description: "",
    image: null,
  });

  const [medicineImage, setMedicineImage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setMedicineImage(URL.createObjectURL(file));
    }
  };

  const price = parseFloat(formData.price) || 0;
  const discount = parseFloat(formData.discount) || 0;

  const finalPrice =
    !isNaN(price) && !isNaN(discount)
      ? price - (price * discount) / 100
      : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      let value = formData[key];
      if (["price", "discount", "stock", "deliveryCharge"].includes(key)) {
        value = parseFloat(value) || 0;
      }
      if (value !== null) {
        form.append(key, value);
      }
    });

    try {
      const response = await fetch("http://localhost:3000/api/medicines", {
        method: "POST",
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        navigate("/");
      } else {
        alert("⚠️ Error: " + result.message);
      }
    } catch (error) {
      console.error("❌ Error adding medicine:", error);
      alert("⚠️ Failed to add medicine.");
    }
  };

  return (
    <div className="container-fluid margin">
      <div className="row">
        <div className="col-md-6 p-0">
          <img
            src={formImg}
            alt="Form"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        <div className="col-md-6">
          <h2 className="py-3 mt-2 text-white text-center bg-success">
            Add Medicine
          </h2>

          <form
            onSubmit={handleSubmit}
            className="p-4"
            encType="multipart/form-data"
          >
            <div className="mb-3">
              <label className="form-label">Medicine Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter Medicine Name"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Model Number</label>
              <input
                type="text"
                name="modelNumber"
                value={formData.modelNumber}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter Model Number"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Brand</label>
              <select
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="form-control"
                required
              >
                <option value="">Select Brand</option>
                <option value="Cipla">Cipla</option>
                <option value="Sun Pharma">Sun Pharma</option>
                <option value="Dr. Reddy's">Dr. Reddy's</option>
                <option value="Lupin">Lupin</option>
                <option value="Zydus">Zydus</option>
                <option value="Glenmark">Glenmark</option>
                <option value="Mankind">Mankind</option>
                <option value="Abbott">Abbott</option>
                <option value="Alkem">Alkem</option>
                <option value="Intas">Intas</option>
              </select>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Category</option>
                  <option>Tablets</option>
                  <option>Capsules</option>
                  <option>Syrup</option>
                  <option>Injections</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">subCategory</label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="form-control"
                  required
                >
                  <option value="">Select Subcategory</option>
                  <option value="Pain Relief">Pain Relief</option>
                  <option value="Antibiotics">Antibiotics</option>
                  <option value="Vitamins">Vitamins</option>
                  <option value="Allergy">Allergy</option>
                  <option value="Skin Care">Skin Care</option>
                  <option value="Heart">Heart</option>
                  <option value="Cold & Flu">Cold & Flu</option>
                  <option value="Diabetes">Diabetes</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Quantity"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Price"
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Discount (%)</label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Discount"
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Final Price (₹)</label>
                <input
                  type="text"
                  className="form-control"
                  value={finalPrice.toFixed(2)}
                  disabled
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Delivery Charge (₹)</label>
                <input
                  type="number"
                  name="deliveryCharge"
                  value={formData.deliveryCharge}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Enter Delivery Charge"
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Status</label>
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                    className="form-check-input"
                  />
                  <label className="form-check-label ms-2">
                    {formData.status ? "Active" : "Inactive"}
                  </label>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-8 mb-3">
                <label className="form-label">Medicine Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-4 mb-3">
                {medicineImage && (
                  <img
                    src={medicineImage}
                    alt="Preview"
                    className="img-thumbnail"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                rows="3"
                placeholder="Write something..."
              ></textarea>
            </div>

            <div className="d-flex">
              <button type="submit" className="btn btn-primary">
                Save Medicine
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
