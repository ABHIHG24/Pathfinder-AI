import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import axios from "axios"; // Ensure axios is installed
import { toast } from "react-toastify"; // Ensure react-toastify is installed
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../utils/api/axiosInstance";
import { loginUser } from "../features/dashboard/DashboardSlice";
import store from "../store";

const RegistrationForm = ({ setRole }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Toggle between login and registration
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!isLogin) {
      const username = formData.get("username");
      const confirmPassword = formData.get("confirmPassword");
      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        setIsSubmitting(false);
        return;
      }

      // Registration
      try {
        await axiosInstance.post("/user/insert", {
          username,
          email,
          password,
          confirmPassword,
        });
        toast.success("Registration successful! Please login.");
        setIsLogin(true);
      } catch (error) {
        toast.error(error.response?.data?.message || "Registration failed.");
      }
    } else {
      // Login
      try {
        const response = await axiosInstance.post("/user/login", {
          UsernameOrEmail: email,
          password,
          role: "user",
        });
        console.log(response);

        dispatch(loginUser(response.data)); // Store user info in redux
        toast.success("Login successful!");

        // Check if the user is an admin and redirect accordingly
        if (response.data.role === "admin") {
          navigate("/admin"); // Redirect to admin dashboard
        } else {
          navigate("/"); // Redirect to user home
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Login failed.");
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="py-16 ">
      <div className="flex  bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        {/* Left Image Section */}
        <div
          className="hidden lg:block lg:w-1/2 bg-cover"
          style={{
            backgroundImage:
              "url('https://www.shutterstock.com/image-vector/never-stop-learning-education-vector-260nw-774864943.jpg')",
          }}
        ></div>

        {/* Right Form Section */}
        <div className="w-full p-8 lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            {isLogin ? "Login to your account" : "Create an account"}
          </h2>
          <p className="text-xl text-gray-600 text-center">
            {isLogin ? "Welcome back!" : "Join us today!"}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none "
                  placeholder="Enter your username"
                  required={!isLogin}
                />
              </div>
            )}
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none"
                placeholder="Enter your password"
                required
              />
            </div>
            {!isLogin && (
              <div className="mt-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            <div className="mt-8">
              <button
                type="submit"
                className={`py-2 px-4 w-full rounded-lg text-white ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Processing..."
                  : isLogin
                  ? "Login"
                  : "Register"}
              </button>
            </div>
          </form>

          {/* Toggle Login/Registration */}
          <div className="mt-4 text-center">
            <h4 className="cursor-pointer text-primary">
              <Link to="/forgetPassword"> Forget Password</Link>
            </h4>
            <button
              onClick={toggleForm}
              className="text-blue-500 hover:underline"
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
