import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { Appointments } from "../services/api";
import { getUser, clearSession } from "../utils/auth";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [alert, setAlert] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  async function load() {
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
    load();
  }, []);

  async function updateStatus(id, status) {
    try {
      await Appointments.updateStatus(id, status);
      setAlert({ type: "success", message: `Marked as ${status}` });
      await load();
    } catch {
      setAlert({ type: "error", message: "Update failed" });
    }
  }

  function logout() {
    clearSession();
    navigate("/");
  }

  return (
    <div className="dashboard-container">
      {alert && <Alert type={alert.type} message={alert.message} />}

      {/* Header */}
      <div className="dashboard-header">
        <h2>Staff Dashboard - {user?.department}</h2>
        <button className="logout-btn" onClick={logout}>
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>

      {/* Table */}
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
                    <div className="patient-info">
                      <span className="patient-name">
                        {appt.firstName} {appt.lastName}
                      </span>
                      <span className="patient-contact">
                        {appt.email || appt.phone}
                      </span>
                    </div>
                  </td>
                  <td>
                    {typeof appt.department === "string"
                      ? appt.department
                      : appt.department?.name}
                  </td>
                  <td>{new Date(appt.appointmentDateTime).toLocaleString()}</td>
                  <td>
                    <span className={`status-${appt.status || "pending"}`}>
                      {appt.status || "pending"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button>Change Status</button>
                    </div>
                  </td>
                  <td>
                    <div className="action-buttons">
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
                      <button className="view-btn">View</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
