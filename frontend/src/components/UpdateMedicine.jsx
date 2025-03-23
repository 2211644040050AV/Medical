import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import formImg from "../assets/form_img.jpg";

export default function UpdateMedicine() {
  const { id } = useParams(); // ✅ Get medicine ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: "",
    price: "",
    discount: "",
    status: true,
    description: "",
    image: null,
  });

  const [medicineImage, setMedicineImage] = useState(null); // ✅ Image preview

  // ✅ Fetch existing medicine data
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/api/medicines/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({ ...data, image: null }); // ✅ Preserve existing data
          if (data.image) {
            setMedicineImage(`http://localhost:3000${data.image}`); // ✅ Display existing image
          }
        })
        .catch((error) => console.error("❌ Error loading medicine:", error));
    }
  }, [id]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Handle file upload & preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setMedicineImage(URL.createObjectURL(file)); // ✅ Preview new image
    }
  };

  // ✅ Compute Final Price
  const finalPrice = formData.price
    ? formData.price - (formData.price * (formData.discount || 0)) / 100
    : 0;

  // ✅ Handle form submission (Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) form.append(key, formData[key]);
    });

    try {
      const response = await fetch(
        `http://localhost:3000/api/medicines/${id}`,
        {
          method: "PUT",
          body: form,
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        navigate("/");
      } else {
        alert("⚠️ Error: " + result.message);
      }
    } catch (error) {
      console.error("❌ Error updating medicine:", error);
      alert("⚠️ Failed to update medicine.");
    }
  };

  return (
    <div className="container-fluid margin">
      <div className="row">
        {/* Left Image Section */}
        <div className="col-md-6 display-img">
          <img
            src={formImg}
            alt="Form Background"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Right Form Section */}
        <div className="col-md-6 container-fluid">
          <h2 className="py-3 mt-2 text-white text-center bg-success">
            Update Medicine
          </h2>

          <form
            onSubmit={handleSubmit}
            className="lbl mt-3 mb-5"
            encType="multipart/form-data"
          >
            {/* Medicine Name */}
            <div className="mb-3">
              <label className="form-label">Medicine Name</label>
              <input
                type="text"
                placeholder="Enter Medicine Name"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              {/* Category */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Category</label>
                <select
                  className="form-control"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option>Tablets</option>
                  <option>Capsules</option>
                  <option>Syrup</option>
                  <option>Injections</option>
                </select>
              </div>

              {/* Stock */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  placeholder="Enter Quantity"
                  className="form-control"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              {/* Price */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Price (₹)</label>
                <input
                  type="number"
                  placeholder="Enter Price"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Discount */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Discount (%)</label>
                <input
                  type="number"
                  placeholder="Enter Discount Value"
                  className="form-control"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              {/* Final Price (Disabled) */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Final Price (₹)</label>
                <input
                  type="text"
                  className="form-control"
                  value={finalPrice.toFixed(2)}
                  disabled
                />
              </div>

              {/* Status */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Status</label>
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                  />
                  <label className="form-check-label ms-2">
                    {formData.status ? "Active" : "Inactive"}
                  </label>
                </div>
              </div>
            </div>

            <div className="row">
              {/* Medicine Image */}
              <div className="col-md-8 mb-3">
                <label className="form-label">Medicine Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  name="image"
                  onChange={handleImageChange}
                />
              </div>
              <div className="col-md-4 mb-3">
                {medicineImage && (
                  <img
                    src={medicineImage}
                    alt="Medicine Preview"
                    className="preview-image mt-3"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </div>
            </div>

            {/* Submit & Cancel Buttons */}
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
