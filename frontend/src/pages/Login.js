import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { Auth } from "../services/api";
import { saveSession } from "../utils/auth";

export default function Login() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    const password = form.get("password");
    try {
      setLoading(true);
      const data = await Auth.login(email, password);
      saveSession(data);
      setAlert({ type: "success", message: "Login successful" });
      setTimeout(() => {
        if (data.role === "admin") navigate("/admin");
        else navigate("/staff");
      }, 600);
    } catch (err) {
      setAlert({ type: "error", message: err?.response?.data?.message || "Login failed" });
    } finally { setLoading(false); }
  }

  return (
    <div className="login-container">
      {alert && <Alert type={alert.type} message={alert.message} />}
      <button className="back-btn" onClick={() => navigate("/")}>
        <i className="fas fa-arrow-left"></i>
      </button>

      <div className="login-form">
        <div className="form-header">
          <i className="fas fa-hospital"></i>
          <h2>Hospital Staff Login</h2>
          <p>Access your Staff Dashboard</p>
        </div>

        <form id="loginForm" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email <span className="required">*</span></label>
            <input type="email" name="email" required />
          </div>
          <div className="form-group">
            <label>Password <span className="required">*</span></label>
            <input type="password" name="password" required />
          </div>
          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
