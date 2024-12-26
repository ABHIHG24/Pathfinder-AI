import React, { useState } from "react";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../utils/api/axiosInstance";

const ResetPassword2 = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isPending, setIsPending] = useState(false); // Track loading state

  const handleChange = (e) => {
    setData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const passw = data.password;
    const repassw = data.confirmPassword;

    if (passw !== repassw) {
      toast.error("Password and re-entered password do not match");
      return;
    }

    if (data.password.length < 6) {
      toast.error("Password should contain at least 6 characters");
      return;
    }

    setIsPending(true); // Start loading
    try {
      const response = await axiosInstance.put(
        `/user/resetPassword/${token}`,
        data
      );
      toast.success("Password reset successful");
      navigate("/login");
    } catch (error) {
      console.error("Error resetting password:", error);
      toast.error("Password reset unsuccessful. Please try again.");
    } finally {
      setIsPending(false); // End loading
    }
  };

  if (isPending) {
    return <Loading />;
  }

  return (
    <div
      id="resetpassw"
      className="flex flex-col items-center justify-center h-screen"
    >
      <h1 className="text-3xl font-bold mb-4">Reset Your Password</h1>
      <label htmlFor="password" className="text-lg font-bold">
        Enter your new password
      </label>
      <input
        type="password"
        required
        id="password"
        name="password"
        value={data.password}
        onChange={handleChange}
        className="border border-gray-400 rounded p-2 mb-4"
      />
      <label htmlFor="rePassword" className="text-lg font-bold">
        Re-enter your new password
      </label>
      <input
        type="password"
        required
        id="rePassword"
        name="confirmPassword"
        value={data.confirmPassword}
        onChange={handleChange}
        className="border border-gray-400 rounded p-2 mb-4"
      />
      <button onClick={handleSubmit} className="btn btn-primary">
        Change Password
      </button>
    </div>
  );
};

export default ResetPassword2;
