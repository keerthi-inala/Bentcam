import React from "react";
import { useNavigate } from "react-router-dom";
import { categorySlugMap } from "../data/categoryMapping";

const Home = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName) => {
    const slug = categorySlugMap[categoryName];
    navigate(`/category/${slug}`);
  };

  return (
    <>
      {/* Hero Carousel Section */}
      <div className="hero">
        <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#mainCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="assets/slider/bentCam_Slide_1.jpg" className="d-block w-100" alt="Slide1" style={{ height: 500, objectFit: "cover" }} />
            </div>
            <div className="carousel-item">
              <img src="assets/slider/bentCam_Slide_2.jpg" className="d-block w-100" alt="Slide2" style={{ height: 500, objectFit: "cover" }} />
            </div>
            <div className="carousel-item">
              <img src="assets/slider/bentCam_Slide_3.jpg" className="d-block w-100" alt="Slide3" style={{ height: 500, objectFit: "cover" }} />
            </div>
          </div>

          <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>

      {/* Featured Categories Section */}
      <section className="featured-categories py-5 bg-light">
        <div className="container text-center">
          <h2 className="fw-bold mb-4">Featured Categories</h2>
          <div className="row justify-content-center">

            {/* Card 1 */}
            <button 
              className="col-md-3 m-3 p-4 bg-white shadow-sm rounded-4 border-0 text-decoration-none"
              onClick={() => handleCategoryClick("Motors & Components")}
              style={{ cursor: "pointer", transition: "transform 0.3s" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <i className="fa fa-cogs text-primary mb-3" style={{ fontSize: "40px" }}></i>
              <h5 className="fw-semibold">Motors & Components</h5>
              <p className="text-muted">Fans, blades, frames and all motor parts</p>
            </button>

            {/* Card 2 */}
            <button 
              className="col-md-3 m-3 p-4 bg-white shadow-sm rounded-4 border-0 text-decoration-none"
              onClick={() => handleCategoryClick("Doors, Glass & Components")}
              style={{ cursor: "pointer", transition: "transform 0.3s" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <i className="fa fa-door-open text-primary mb-3" style={{ fontSize: "40px" }}></i>
              <h5 className="fw-semibold">Doors, Glass & Components</h5>
              <p className="text-muted">Gaskets, frames, handles and more</p>
            </button>

            {/* Card 3 */}
            <button 
              className="col-md-3 m-3 p-4 bg-white shadow-sm rounded-4 border-0 text-decoration-none"
              onClick={() => handleCategoryClick("Controls & Electrical")}
              style={{ cursor: "pointer", transition: "transform 0.3s" }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <i className="fa fa-plug text-primary mb-3" style={{ fontSize: "40px" }}></i>
              <h5 className="fw-semibold">Controls & Electrical</h5>
              <p className="text-muted">Controllers, sensors, relays, LEDs, and electrical parts</p>
            </button>

          </div>
        </div>
      </section>

      {/* Why Bentcam Section */}
      <section className="why-bentcam py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-5">Why Bentcam?</h2>
          <div className="row g-4">
            {/* Column 1 */}
            <div className="col-md-4">
              <div className="d-flex mb-4">
                <div className="me-3">
                  <div className="rounded-circle border-2 border-dark d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <i className="fa fa-star fs-5"></i>
                  </div>
                </div>
                <div>
                  <h5 className="fw-semibold">Products targeting high visibility</h5>
                </div>
              </div>

              <div className="d-flex mb-4">
                <div className="me-3">
                  <div className="rounded-circle border-2 border-dark d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <i className="fa fa-star fs-5"></i>
                  </div>
                </div>
                <div>
                  <h5 className="fw-semibold">Up to 500000 tests</h5>
                </div>
              </div>

              <div className="d-flex">
                <div className="me-3">
                  <div className="rounded-circle border-2 border-dark d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <i className="fa fa-star fs-5"></i>
                  </div>
                </div>
                <div>
                  <h5 className="fw-semibold">Disassembled option providing freight advantage</h5>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div className="col-md-4">
              <div className="d-flex mb-4">
                <div className="me-3">
                  <div className="rounded-circle border-2 border-dark d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <i className="fa fa-star fs-5"></i>
                  </div>
                </div>
                <div>
                  <h5 className="fw-semibold">Anti-rust materials</h5>
                </div>
              </div>

              <div className="d-flex mb-4">
                <div className="me-3">
                  <div className="rounded-circle border-2 border-dark d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <i className="fa fa-star fs-5"></i>
                  </div>
                </div>
                <div>
                  <h5 className="fw-semibold">Automatic locking mechanisms</h5>
                </div>
              </div>

              <div className="d-flex">
                <div className="me-3">
                  <div className="rounded-circle border-2 border-dark d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <i className="fa fa-star fs-5"></i>
                  </div>
                </div>
                <div>
                  <h5 className="fw-semibold">Use of argon gas in all double glazing to improve thermal insulation</h5>
                </div>
              </div>
            </div>

            {/* Column 3 */}
            <div className="col-md-4">
              <div className="d-flex mb-4">
                <div className="me-3">
                  <div className="rounded-circle border-2 border-dark d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <i className="fa fa-star fs-5"></i>
                  </div>
                </div>
                <div>
                  <h5 className="fw-semibold">Design details that prevent heat transfer</h5>
                </div>
              </div>

              <div className="d-flex mb-4">
                <div className="me-3">
                  <div className="rounded-circle border-2 border-dark d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <i className="fa fa-star fs-5"></i>
                  </div>
                </div>
                <div>
                  <h5 className="fw-semibold">Spare parts available for 10 years after sales</h5>
                </div>
              </div>

              <div className="d-flex">
                <div className="me-3">
                  <div className="rounded-circle border-2 border-dark d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                    <i className="fa fa-star fs-5"></i>
                  </div>
                </div>
                <div>
                  <h5 className="fw-semibold">Energy-saving antiperspirant constructions that do not require resistance</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
