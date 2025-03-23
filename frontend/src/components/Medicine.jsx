import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Medicine() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/medicines");
        if (!response.ok) throw new Error("Failed to fetch medicines");

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid data format");

        setMedicines(data);
      } catch (error) {
        console.error("❌ Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  }, []);


  const handleDelete = async (id) => {
    if (!id) {
      alert("⚠️ Invalid Medicine ID");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this medicine?")) return;

    try {
      const response = await fetch(`http://localhost:3000/api/medicines/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        if (response.status === 404) {
          alert("⚠️ Medicine not found (already deleted)");
        } else {
          const errorData = await response.json();
          alert(`⚠️ Error: ${errorData.message || "Failed to delete medicine"}`);
        }
        return;
      }

      // ✅ Fix: Ensure the latest state is used
      setMedicines((prevMedicines) => prevMedicines.filter((medicine) => medicine._id !== id));

      alert("✅ Medicine deleted successfully!");
    } catch (error) {
      console.error("❌ Error deleting medicine:", error);
      alert("⚠️ Error deleting the medicine. Please check your connection.");
    }
  };

  return (
    <div className="container-fluid vh-100 p-3">
      <div className="row align-items-center">
        <div className="col-md-6">
          <h1>Manage Products</h1>
        </div>
        <div className="col-md-6 d-flex justify-content-end">
          <Link to="/add" className="btn btn-success">
            Add Medicine
          </Link>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 table-responsive">
          <table className="table table-striped table-bordered mt-3">
            <thead className="table-dark text-center">
              <tr>
                <th>S.No.</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Original Price</th>
                <th>Discount</th>
                <th>Final Price</th>
                <th>Status</th>
                <th>Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {medicines.length > 0 ? (
                medicines.map((medicine, index) => (
                  <tr key={medicine._id}>
                    <td className="text-center">{index + 1}</td>
                    <td>{medicine.name}</td>
                    <td>{medicine.category}</td>
                    <td className="text-center">{medicine.stock ?? 0}</td>
                    <td className="text-center">₹{(medicine.price ?? 0).toFixed(2)}</td>
                    <td className="text-center">{medicine.discount ?? 0}%</td>
                    <td className="text-center">
                      ₹{((medicine.price ?? 0) - ((medicine.price ?? 0) * (medicine.discount ?? 0)) / 100).toFixed(2)}
                    </td>
                    <td className="text-center">
                      <span className={`badge ${medicine.status ? "bg-success" : "bg-danger"}`}>
                        {medicine.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="text-center">
                      {medicine.image ? (
                        <img
                          src={`http://localhost:3000${medicine.image}`}
                          alt={medicine.name || "Medicine Image"}
                          width="50"
                          height="50"
                          style={{ objectFit: "cover", minHeight: "50px" }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td className="d-flex align-items-center gap-2 justify-content-center">
                      <Link to={`/edit/${medicine._id}`} className="btn btn-primary">
                        Update
                      </Link>

                      <button className="btn btn-danger" onClick={() => handleDelete(medicine._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center">
                    No medicines available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
