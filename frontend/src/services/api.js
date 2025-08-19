import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const Auth = {
  async login(email, password) {
    const { data } = await api.post("/auth/login", { email, password });
    return data;
  },
  async registerStaff({ name, email, password, department }) {
    const { data } = await api.post("/auth/register", {
      name, email, password, role: "staff", department
    });
    return data;
  }
};

export const Chat = {
  async send({ history, message }) {
    const { data } = await api.post("/chatbot/chat", { history, message });
    return data;
  }
};

export const Appointments = {
  async create(payload) {
    const { data } = await api.post("/appointments", payload);
    return data;
  },
  async listForDepartment() {
    const { data } = await api.get("/appointments/department");
    return data;
  },
  async updateStatus(id, status) {
    const { data } = await api.put(`/appointments/${id}/status`, { status });
    return data;
  }
};

export const Patients = {
  async getById(patientId) {
    const { data } = await api.get(`/patients/${patientId}`);
    return data;
  }
};
