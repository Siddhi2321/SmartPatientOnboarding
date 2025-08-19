import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="sidebar">
        <div className="brand">
          <span>Your health our priority</span>
          <h1>MediCare</h1>
        </div>
      </div>

      <div className="main-content">
        <div className="header">
          <button className="login-btn" onClick={() => navigate("/login")}>
            <i className="fas fa-user"></i> Staff Login
          </button>
        </div>

        <div className="welcome-section">
          <h2>Welcome to</h2>
          <h1>MediCare Hospital</h1>
          <p>Get expert medical consultation and book appointments easily</p>
        </div>

        <div className="service-cards">
          <div className="service-card">
            <div className="card-icon"><i className="fas fa-robot"></i></div>
            <h3>Chat with AI Doctor</h3>
            <p>Get expert medical consultation and book appointments easily</p>
            <button className="primary-btn" onClick={() => navigate("/chatbot")}>
              Start Consultation
            </button>
          </div>

          <div className="service-card">
            <div className="card-icon"><i className="fas fa-calendar-plus"></i></div>
            <h3>Book Appointment</h3>
            <p>Schedule your visit with our specialist doctors</p>
            <button className="primary-btn" onClick={() => navigate("/book-appointment")}>
              Book Now
            </button>
          </div>
        </div>

        <div className="services-section">
          <h3>Our Services</h3>
          <div className="service-pills">
            <span className="service-pill">CT Scan</span>
            <span className="service-pill">MRI</span>
            <span className="service-pill">Blood Test</span>
            <span className="service-pill">X-RAY</span>
            <span className="service-pill">CT Scan</span>
            <span className="service-pill">CT Scan</span>
          </div>
        </div>
      </div>
    </div>
  );
}
