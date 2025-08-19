import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="brand">
          <span>Your health our priority</span>
          <h1>MediCare</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <button className="login-btn" onClick={() => navigate("/login")}>
            <i className="fas fa-user"></i> Staff Login
          </button>
        </div>

        {/* Welcome Section */}
        <div className="welcome-section">
          <h2>Welcome to</h2>
          <h1>MediCare Hospital</h1>
          <p>Get expert medical consultation and book appointments easily</p>
        </div>

        {/* Service Cards */}
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

        {/* Services Section */}
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

        {/* Info Card */}
        <div className="service-card">
          <div className="card-icon"><i className="fas fa-hospital-user"></i></div>
          <h3>How MediCare Works</h3>
          <p>
            MediCare is designed to make healthcare simple and stress-free.  
            Patients can chat with our AI doctor for quick guidance, book appointments online, 
            and avoid long waiting times. Every record stays securely stored, so you don’t 
            need to repeat your history on each visit.  
            <br /><br />
            For our hospital staff, MediCare streamlines appointment management, 
            reduces paperwork, and ensures doctors spend more time with patients instead of handling admin tasks.  
            <strong> One platform — better care for patients, smoother workflow for staff.</strong>
          </p>
        </div>

        {/* Footer Contact Card */}
        <div className="footer-card">
          <i className="fas fa-envelope"></i>
          <h4>Have Questions? Connect With Us</h4>
          <p>
            📧 <a href="mailto:contact@medicarehospital.com">contact@medicarehospital.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
