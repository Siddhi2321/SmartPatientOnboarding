import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { Appointments, Auth } from "../services/api";
import { getUser, clearSession } from "../utils/auth";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = getUser();
  const [alert, setAlert] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);

  useEffect(() => { if (!user) navigate("/login"); }, [user, navigate]);

  async function load() {
    try {
      setLoading(true);
      const data = await Appointments.listForDepartment();
      setRows(data || []);
    } catch {
      setAlert({ type: "error", message: "Failed to load appointments" });
    } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    try {
      await Appointments.updateStatus(id, status);
      setAlert({ type: "success", message: `Marked as ${status}` });
      await load();
    } catch {
      setAlert({ type: "error", message: "Update failed" });
    }
  }

  async function createStaff(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      const created = await Auth.registerStaff({
        name: f.get("staffName"),
        email: f.get("staffEmail"),
        password: f.get("staffPassword"),
        department: f.get("staffDepartment")
      });
      setStaff(s => [...s, created]);
      setAlert({ type: "success", message: "Staff member created" });
      e.currentTarget.reset();
    } catch {
      setAlert({ type: "error", message: "Failed to create staff" });
    }
  }

  function logout() {
    clearSession();
    navigate("/");
  }

  return (
    <div className="dashboard-container">
      {alert && <Alert type={alert.type} message={alert.message} />}
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <h3>Appointments</h3>
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
            <tr><td colSpan="5">Loading…</td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan="5">No appointment requests found</td></tr>
          ) : rows.map(appt => (
            <tr key={appt._id}>
              <td>{appt.firstName} {appt.lastName}</td>
              <td>{appt.department}</td>
              <td>{new Date(appt.appointmentDateTime).toLocaleString()}</td>
              <td>{appt.status}</td>
              <td>
                <button onClick={() => updateStatus(appt._id, "approved")}>Approve</button>
                <button onClick={() => updateStatus(appt._id, "rejected")}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Create Staff</h3>
      <form onSubmit={createStaff}>
        <input type="text" name="staffName" placeholder="Name" required />
        <input type="email" name="staffEmail" placeholder="Email" required />
        <input type="password" name="staffPassword" placeholder="Password" required />
        <select name="staffDepartment" required>
          <option value="">Department</option>
          <option>Cardiology</option>
          <option>Neurology</option>
          <option>Radiology</option>
          <option>Emergency</option>
        </select>
        <button type="submit">Create</button>
      </form>

      <h3>Staff List</h3>
      <ul>
        {staff.map((s, i) => (
          <li key={i}>{s.name} - {s.email} ({s.department})</li>
        ))}
      </ul>
    </div>
  );
}
