import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
    // KUNCI UTAMA: Tambahkan ini agar Ngrok tidak memblokir request frontend kamu
    "ngrok-skip-browser-warning": "true",
  },
  withCredentials: true, // Bagus untuk menjaga session/cookies jika diperlukan nanti
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;