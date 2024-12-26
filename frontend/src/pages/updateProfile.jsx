import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { editProfile } from "../features/dashboard/DashboardSlice";
import axios from "axios";

const UpdateProfile = () => {
  const user = useSelector((state) => state.userState.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initialize the form with current user data
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePhoto, setProfilePhoto] = useState(null); // Store the image file

  // Handle image selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      // Check if it's an image
      setProfilePhoto(file); // Set the selected file
    } else {
      toast.error("Please select a valid image file.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Create FormData to send both text and file data
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);

    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }

    try {
      // Make the Axios request to update the user profile with FormData
      const response = await axios.put(
        "http://localhost:5000/api/v1/user/me/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file upload
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        // Update the Redux store with new data
        const updatedUser = {
          ...user,
          username,
          email,
          profilePhoto: response.data.profilePhoto,
        };
        dispatch(editProfile(updatedUser));

        // Notify user of success
        toast.success("Profile updated successfully!");

        // Navigate to the profile page
        navigate("/profile");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating your profile.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-center text-secondary mb-8">
        Update Profile
      </h2>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="flex flex-col gap-4">
          <label className="label">
            <span className="label-text">Username</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </label>

          <label className="label">
            <span className="label-text">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </label>

          <label className="label">
            <span className="label-text">Profile Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="input input-bordered w-full"
            />
          </label>
        </div>

        <div className="flex gap-4 justify-center">
          <button type="submit" className="btn btn-success w-full max-w-xs">
            Save Changes
          </button>
          <button
            type="button"
            className="btn btn-error w-full max-w-xs"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
