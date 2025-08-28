import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import axiosInstance from "../utils/api/axiosInstance";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const user = useSelector((state) => state.userState.user);
  const { username, email, profilePhoto } = user;
  const img = profilePhoto
    ? `${import.meta.env.VITE_API_BASE_URL}/${user.profilePhoto}`
    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQDKWUgyPYinvZYb-8lbLAsCPp4j_toM09lQ&s";

  // State to manage the form visibility and time
  const [showForm, setShowForm] = useState(false);
  const [time, setTime] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(time);

    try {
      const response = await axiosInstance.post("/user/set-alarm", { time });

      toast.success("Alarm set successfully!");
      setShowForm(false); // Close the form after successful submission
    } catch (error) {
      toast.error(
        "Failed to set alarm: " + error.response?.data?.message ||
          "Unknown error"
      );
    }
  };

  // Handle cancel action
  const handleCancel = () => {
    setShowForm(false); // Close the form
  };

  return (
    <div className="flex justify-evenly gap-20 h-auto relative p-8">
      {/* Profile Details */}
      <div className="avatar h-80 flex flex-col gap-10">
        <div className="w-auto h-auto rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img src={img} alt="Profile" />
        </div>
      </div>

      <div className="flex flex-col font-bold gap-6">
        <h2 className="text-2xl font-extrabold text-secondary">{username}</h2>
        <p>Email: {email}</p>
        <NavLink to="update_profile">
          <button className="btn btn-success">Edit profile</button>
        </NavLink>
        <NavLink to="update_password">
          <button className="btn btn-error">Change password</button>
        </NavLink>

        {/* Button to Open Sticky Alarm Form */}
        <button
          onClick={() => setShowForm(true)}
          className="mt-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
        >
          Set Alarm
        </button>
      </div>

      {/* Sticky Alarm Form */}
      {showForm && (
        <div className="fixed bottom-5 right-5 bg-white p-5 rounded-lg shadow-lg w-72">
          <h3 className="text-xl font-semibold mb-3">Set Alarm</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center space-x-2">
              <label htmlFor="time" className="text-gray-700">
                Time:
              </label>
              <input
                type="time"
                id="time"
                name="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
