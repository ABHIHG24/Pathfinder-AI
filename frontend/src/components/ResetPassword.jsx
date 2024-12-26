import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../utils/api/axiosInstance";

const ResetPassword = () => {
  const [submit, setSubmit] = useState(false); // Tracks if submission is complete
  const [email, setEmail] = useState(""); // Stores email input
  const [isPending, setIsPending] = useState(false); // Tracks if the request is in progress

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsPending(true);

    try {
      await axiosInstance.post("/user/forgetPassword", { email });
      setSubmit(true);
      toast.success("Email sent successfully! Check your inbox.");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      {submit ? (
        <div
          id="reset-pass"
          className="flex flex-col items-center justify-center h-screen bg-gray-100"
        >
          <h1 className="text-4xl font-bold text-gray-700 mb-4">Thank You!</h1>
          <p className="text-lg text-gray-600">
            Please check your email for further instructions.
          </p>
          <button
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
            onClick={() => setSubmit(false)}
          >
            Back
          </button>
        </div>
      ) : (
        <div
          id="reset-pass"
          className="flex flex-col items-center justify-center h-screen bg-gray-100"
        >
          <h1 className="text-4xl font-bold text-gray-700 mb-6">
            Forgot Your Password?
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Enter your email below, and we'll send you instructions to reset
            your password.
          </p>
          <div className="flex flex-col items-center">
            <label
              htmlFor="email"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500 mb-4"
              required
            />
            <button
              className={`px-6 py-2 text-white rounded-lg shadow-md ${
                isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } transition`}
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending ? "Sending..." : "Send Email"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ResetPassword;
