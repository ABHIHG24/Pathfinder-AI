import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;
// console.log(import.meta.env.VITE_API_BASE_URL);

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: baseURL, // Base URL from environment variables
  timeout: 5000, // Request timeout in milliseconds
  headers: {
    "Content-Type": "application/json", // Default content type
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Try refreshing token if expired
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const newToken = await refreshAuthToken(refreshToken);
          localStorage.setItem("authToken", newToken);
          error.config.headers["Authorization"] = `Bearer ${newToken}`;
          return axiosInstance(error.config); // Retry original request
        } catch (err) {
          // Handle refresh token failure (e.g., redirect to login)
        }
      }
    }
    return Promise.reject(error); // Reject the error
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Any response modifications if necessary
    return response; // Return only the data from the response
  },
  (error) => {
    // Handle response errors globally
    if (error.response) {
      // Server responded with a status outside of 2xx
      console.error("Error response:", error.response);
    } else if (error.request) {
      // No response received from server
      console.error("No response received:", error.request);
    } else {
      // Something went wrong in setting up the request
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error); // Reject the promise with the error
  }
);

export default axiosInstance;
