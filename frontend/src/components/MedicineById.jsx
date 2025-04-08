import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const MedicineById = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/medicines/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.error("Product fetch error:", err);
      });
  }, [id]);

  const increaseQty = () => {
    if (product && quantity < product.stock && quantity < 5) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!product) return <div className="text-center mt-5">Loading...</div>;

  const price = parseFloat(product.price) || 0;
  const discount = parseFloat(product.discount) || 0;
  const salePrice = price - (price * discount) / 100;
  const youSave = price - salePrice;

  return (
    <div className="container mt-4 border p-4 rounded shadow">
      <div className="row">
        <div className="col-md-5 text-center">
          <img
            src={`http://localhost:3000${product.image}`}
            alt={product.name}
            className="img-fluid mb-3 product-image"
            style={{ maxHeight: "300px", transition: "transform 0.3s ease" }}
          />

          <h6>{product.name}</h6>
        </div>

        <div className="col-md-7">
          <h2>{product.name}</h2>

          <div className="mb-2">
            <span className="bg-success text-white p-1 rounded">
              4.6 <i className="fa fa-star"></i>
            </span>
            &nbsp;| {product.modelNumber}
          </div>

          <div>
            <span className="text-success fw-bold me-2">
              ₹ {salePrice.toFixed(2)}
            </span>
            <span className="text-muted text-decoration-line-through me-2">
              ₹ {price.toFixed(2)}
            </span>
            <span className="text-danger fw-semibold">{discount}% OFF</span>
            <br />
            <small className="text-muted">You Save ₹ {youSave.toFixed(2)}</small>
          </div>

          <div className="mt-2">
            {product.stock > 0 && product.stock <= 10 && (
              <span className="text-danger fw-bold">Only {product.stock} Left</span>
            )}
            {product.stock > 10 && (
              <span className="text-success fw-bold">In-Stock</span>
            )}
            {product.stock <= 0 && (
              <span className="text-warning fw-bold">Out of Stock</span>
            )}
          </div>

          <div className="mt-2">
            <strong>Brand:</strong> {product.brand} <br />
            <strong>Category:</strong> {product.category} <br />
            <strong>Item Type:</strong> {product.subcategory}
          </div>

          <div className="mt-3 text-primary fw-bold">
            <span>
              Delivery Charges:{" "}
              {!product.deliveryCharge ? "Free" : `₹ ${product.deliveryCharge}`}
              {!product.deliveryCharge && (
                <i className="fa fa-thumbs-up text-success ms-1"></i>
              )}
            </span>
          </div>

          <div className="mt-3">
            <h5>Description</h5>
            <p>{product.description}</p>
          </div>

          <div className="input-group mt-3" style={{ width: "120px" }}>
            <button className="btn btn-outline-dark" onClick={decreaseQty}>
              <i className="fa fa-minus-circle"></i>
            </button>
            <input
              type="text"
              value={quantity}
              readOnly
              className="form-control text-center"
            />
            <button className="btn btn-outline-dark" onClick={increaseQty}>
              <i className="fa fa-plus-circle"></i>
            </button>
          </div>

          {product.stock >= 3 ? (
            <div className="mt-4">
              <Link to="/place-order" className="btn btn-warning">
                <i className="fa fa-bolt"></i> Continue Shopping
              </Link>
            </div>
          ) : null}

        </div>
      </div>
    </div>
  );
};

export default MedicineById;
