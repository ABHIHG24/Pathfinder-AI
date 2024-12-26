import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/api/axiosInstance";

const UpdatePassword = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const { oldPassword, newPassword, confirmPassword } = data;

    if (newPassword !== confirmPassword) {
      toast.error("Password and re-entered password do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password should contain at least 6 characters");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.put("/user/password/update", data);
      toast.success("Password changed successfully");
      navigate("/Profile");
    } catch (err) {
      toast.error("Password change unsuccessful. Please try again.");
      console.error("Error updating password:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center  py-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Change Your Password
      </h1>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="space-y-4">
          <div>
            <label
              htmlFor="oldPassword"
              className="block text-lg font-semibold text-gray-700"
            >
              Enter your current password
            </label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={data.oldPassword}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-lg font-semibold text-gray-700"
            >
              Enter your new password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={data.newPassword}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-lg font-semibold text-gray-700"
            >
              Re-enter your new password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
              disabled={isLoading}
            >
              {isLoading ? "Changing..." : "Change Password"}
            </button>
            <button
              onClick={() => navigate("/me")}
              className="w-full py-3 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all"
            >
              Go to Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
