import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  // NO NEED to set Authorization header here
  withCredentials: true, // This is the key part that sends cookies
});

// Your interceptor for handling errors or refreshing tokens can remain
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Your error handling logic here...
    console.error("Error response data:", error.response?.data);
    return Promise.reject(error);
  }
);

export default axiosInstance;
