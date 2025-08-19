import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { Appointments, Patients } from "../services/api"; // Added Patients API
import { getUser, clearSession } from "../utils/auth";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const user = getUser();

  // state
  const [alert, setAlert] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("appointments");
  const [searchId, setSearchId] = useState("");
  const [patientResult, setPatientResult] = useState(null);

  // redirect if no user
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // load appointments
  async function loadAppointments() {
    try {
      setLoading(true);
      const data = await Appointments.listForDepartment();
      setRows(data || []);
    } catch {
      setAlert({ type: "error", message: "Failed to load appointments" });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadAppointments();
  }, []);

  // approve/reject
  async function updateStatus(id, status) {
    try {
      await Appointments.updateStatus(id, status);
      setAlert({ type: "success", message: ` Marked as ${status}` });
      await loadAppointments();
    } catch {
      setAlert({ type: "error", message: "Update failed" });
    }
  }

  // search patient by ID
  async function searchPatient() {
    if (!searchId.trim()) return;
    try {
      const result = await Patients.getById(searchId);
      if (result) {
        setPatientResult(result);
      } else {
        setPatientResult(null);
        setAlert({ type: "info", message: "No patient found" });
      }
    } catch {
      setAlert({ type: "error", message: "Search failed" });
    }
  }

  // logout
  function logout() {
    clearSession();
    navigate("/");
  }

  return (
    <div className="dashboard-container">
      {alert && <Alert type={alert.type} message={alert.message} />}

      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <i className="fas fa-clipboard-list"></i>
          <div className="header-info">
            <h2>Staff Dashboard</h2>
            <p>
              Welcome back, <span>{user?.name || "Staff"}</span> –{" "}
              <span>{user?.department}</span>
            </p>
          </div>
        </div>
        <button className="logout-btn" onClick={logout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-btn ${activeTab === "appointments" ? "active" : ""}`}
          onClick={() => setActiveTab("appointments")}
        >
          <i className="fas fa-calendar-check"></i> Appointments
        </button>
        <button
          className={`tab-btn ${activeTab === "patients" ? "active" : ""}`}
          onClick={() => setActiveTab("patients")}
        >
          <i className="fas fa-file-medical"></i> Patient Record
        </button>
      </div>

      {/* Appointments Tab */}
      {activeTab === "appointments" && (
        <div id="appointments-tab" className="tab-content active">
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Appointment Requests</h3>
              <p>Manage and approve appointment requests for your department</p>
            </div>

            <div className="table-container">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Patients</th>
                    <th>Department</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5">Loading…</td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan="5">No appointment requests found</td>
                    </tr>
                  ) : (
                    rows.map((appt) => (
                      <tr key={appt._id}>
                        <td>
                          {appt.firstName} {appt.lastName}
                        </td>
                        <td>
                          {typeof appt.department === "string"
                            ? appt.department
                            : appt.department?.name}
                        </td>
                        <td>
                          {new Date(appt.appointmentDateTime).toLocaleString()}
                        </td>
                        <td>{appt.status}</td>
                        <td className="action-buttons">
                          <button
                            className="approve-btn"
                            onClick={() => updateStatus(appt._id, "approved")}
                          >
                            Approve
                          </button>
                          <button
                            className="reject-btn"
                            onClick={() => updateStatus(appt._id, "rejected")}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Patient Record Tab */}
      {activeTab === "patients" && (
        <div id="patient-record-tab" className="tab-content active">
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Search Patient</h3>
              <p>Enter patient ID to view complete medical history</p>
            </div>

            <div className="search-container">
              <div className="search-box">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  placeholder="Enter Patient ID"
                />
                <button className="search-btn" onClick={searchPatient}>
                  <i className="fas fa-search"></i> Search
                </button>
              </div>
            </div>

            <div className="patient-results">
              {patientResult ? (
                <div className="patient-card">
                  <h4>
                    {patientResult.firstName} {patientResult.lastName}
                  </h4>
                  <div className="patient-details">
                    <p>
                      <strong>ID:</strong> {patientResult.patientId}
                    </p>
                    <p>
                      <strong>Age:</strong> {patientResult.age}
                    </p>
                    <p>
                      <strong>Gender:</strong> {patientResult.gender}
                    </p>
                    <p>
                      <strong>Contact:</strong> {patientResult.phone}
                    </p>
                  </div>
                </div>
              ) : (
                <p>No patient data</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
