import axios from "axios";

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI || "http://localhost:5000";
const axiosInstance = axios.create({
  baseURL: BACKEND_URI,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 100000, // Set a timeout of 10 seconds
});

export default axiosInstance;
