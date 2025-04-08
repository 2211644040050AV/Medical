import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import formImg from "../assets/form_img1.jpg";

export default function UpdateMedicine() {
  const { id } = useParams(); // ✅ Get medicine ID from URL
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);


  useEffect(() => {
    fetch("http://localhost:3000/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((err) => console.error("Failed to load brands:", err));
  }, []);
  

  const [formData, setFormData] = useState({
    name: "",
    modelNumber: "",
    brand: "",
    category: "",
    subCategory: "",
    stock: "",
    price: "",
    discount: "",
    deliveryCharge: "",
    status: false,
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
        <div className="col-md-6 display-img p-0 m-0"> 
          <img
            src={formImg}
            alt="Form Background"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Right Form Section */}
        <div className="col-md-6">
          <h2 className="py-3 mt-2 text-white text-center bg-success">
            Update Medicine
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
