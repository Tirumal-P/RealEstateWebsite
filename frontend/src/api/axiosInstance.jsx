import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is due to token expiration
    if (
      error.response.data &&
      (error.response.data == "Invalid token")
    ) {
      // Clear local storage
      localStorage.removeItem("token");
      if (localStorage.getItem("user") == "admin") {
        navigate("/admin");
      } else {
        // Redirect to login page
        window.location = "/login";
      }
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
    }
    return Promise.reject(error);
  }
);

// For adding token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
