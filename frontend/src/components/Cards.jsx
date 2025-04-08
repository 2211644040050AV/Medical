import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Custom Arrows
const NextArrow = ({ onClick }) => (
  <div className="custom-arrow slick-arrow slick-next" onClick={onClick}>
    <i className="fas fa-chevron-right"></i>
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="custom-arrow slick-arrow slick-prev" onClick={onClick}>
    <i className="fas fa-chevron-left"></i>
  </div>
);

export default function Cards() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveMedicines = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/medicines');
        const data = await res.json();
        const active = data.filter((product) => product.status === true);
        setProducts(active);
      } catch (err) {
        console.error("❌ Error fetching medicines:", err);
      }
    };

    fetchActiveMedicines();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="container-fluid px-4 py-3">
      <div className="row">
        <div className="col-md-12">
          <div className="headingline mx-4">
            <span>Medicine</span>
          </div>
        </div>
      </div>

      <div className="row pt-3">
        <div className="col-md-12 text-center">
          <section id="sec2" className="prdcarousel">
            <div className="moreitem mb-2">
              <a href="#" className="btn btn-primary btn-sm">See All</a>
            </div>

            <Slider {...settings}>
              {products.length > 0 ? (
                products.map((product, index) => {
                  const price = Number(product.price) || 0;
                  const discount = Number(product.discount) || 0;
                  const finalPrice = price - (price * discount) / 100;

                  return (
                    <div
                      key={index}
                      className="px-3"
                      onClick={() => navigate(`/medicine/${product._id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="card h-100 shadow-sm hover-card"
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "0.5rem",
                          overflow: "hidden",
                        }}
                      >
                        {product.image && (
                          <img
                            src={`http://localhost:3000${product.image}`}
                            alt={product.name}
                            className="card-img-top"
                            style={{
                              height: "200px",
                              width: "250px",
                              objectFit: "contain",
                              background: "transparent",
                              padding: "10px",
                              borderTopLeftRadius: "0.5rem",
                              borderTopRightRadius: "0.5rem",
                            }}
                          />
                        )}
                        <div className="card-body text-start">
                          <h5 className="fw-bold mb-1" style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: "100%",
                          }}>
                            {product.name}
                          </h5>

                          {/* <p className="text-muted small mb-2">
                            {product.description?.length > 60
                              ? product.description.slice(0, 50) + '...'
                              : product.description}
                          </p> */}

                          <div className="mb-2">
                            <span className="bg-success text-white rounded px-2 py-1 small">
                              4.6 <i className="fas fa-star"></i>
                            </span>
                            {[...Array(4)].map((_, i) => (
                              <i key={i} className="fas fa-star text-warning small ms-1"></i>
                            ))}
                            <i className="fas fa-star text-secondary small ms-1"></i>
                          </div>

                          <div className="pt-2">
                            <span className="text-danger text-decoration-line-through me-2">
                              ₹{price.toFixed(2)}
                            </span>
                            <span className="fw-bold text-success me-2">
                              ₹{finalPrice.toFixed(2)}
                            </span>
                            <span className="badge bg-warning text-dark">{discount}% OFF</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center w-100">
                  <p>No active products available.</p>
                </div>
              )}
            </Slider>
          </section>
        </div>
      </div>
    </div>
  );
}
