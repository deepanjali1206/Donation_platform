import axios from "axios";

const api = axios.create({
  baseURL: "https://donation-platform-2xhl.onrender.com",
  withCredentials: false
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("jwt");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
