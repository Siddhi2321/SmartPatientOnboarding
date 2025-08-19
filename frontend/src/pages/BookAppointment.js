import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { Appointments } from "../services/api";

export default function BookAppointment() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Set minimum datetime to "now"
  useEffect(() => {
    const input = document.getElementById("preferredDateTime");
    if (input) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      input.min = now.toISOString().slice(0, 16);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);

    const payload = {
      firstName: f.get("firstName"),
      lastName: f.get("lastName"),
      email: f.get("emailId"),
      phone: f.get("phoneNumber"),
      dateOfBirth: f.get("dateOfBirth"),
      emergencyContact: f.get("emergencyContact"),
      address: f.get("address"),
      department: f.get("department"),
      departmentName: f.get("department"),
      appointmentDateTime: f.get("preferredDateTime"),
      reason: f.get("symptoms"),
      symptoms: f.get("symptoms"),
    };

    try {
      setSubmitting(true);
      await Appointments.create(payload);
      setAlert({ type: "success", message: "Appointment request submitted!" });
      e.currentTarget.reset();
      setTimeout(() => navigate("/"), 900);
    } catch (err) {
      setAlert({
        type: "error",
        message:
          err?.response?.data?.message || "Could not submit appointment",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="appointment-container">
      {alert && <Alert type={alert.type} message={alert.message} />}

      <div className="appointment-header">
        <button className="back-btn" onClick={() => navigate("/")}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <div className="header-info">
          <i className="fas fa-calendar-plus"></i>
          <h2>Book Appointment</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="appointment-content">
        <div className="form-group">
          <label>First Name *</label>
          <input type="text" name="firstName" required />
        </div>
        <div className="form-group">
          <label>Last Name *</label>
          <input type="text" name="lastName" required />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input type="email" name="emailId" required />
        </div>
        <div className="form-group">
          <label>Phone *</label>
          <input type="tel" name="phoneNumber" required />
        </div>
        <div className="form-group">
          <label>Date of Birth *</label>
          <input type="date" name="dateOfBirth" required />
        </div>
        <div className="form-group">
          <label>Emergency Contact *</label>
          <input type="tel" name="emergencyContact" required />
        </div>
        <div className="form-group">
          <label>Address *</label>
          <input type="text" name="address" required />
        </div>
        <div className="form-group">
          <label>Department *</label>
          <select name="department" required>
            <option value="">Select Department</option>
            <option>Cardiology</option>
            <option>Neurology</option>
            <option>Orthopedics</option>
            <option>Pediatrics</option>
            <option>Dermatology</option>
            <option>Radiology</option>
            <option>Emergency</option>
          </select>
        </div>
        <div className="form-group">
          <label>Date & Time *</label>
          <input
            type="datetime-local"
            id="preferredDateTime"
            name="preferredDateTime"
            required
          />
        </div>
        <div className="form-group">
          <label>Symptoms *</label>
          <textarea name="symptoms" required></textarea>
        </div>

        <div className="submit-section">
          <button
            type="submit"
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}