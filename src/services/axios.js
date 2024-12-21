import axios from "axios";
import { useAuthStore } from "../store/auth"; // Import the auth store

const instance = axios.create({
  baseURL: "http://localhost:4000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore(); // Access the auth store
    const token = authStore.token; // Get the token from the store

    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add Bearer token to Authorization header
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    return Promise.reject(error);
  }
);

export default instance;
