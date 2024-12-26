import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/api/axiosInstance";

const FitnessForm = () => {
  const [formData, setFormData] = useState({
    age: "", // User's age
    gender: "", // User's gender
    fitnessGoals: [], // Goals for fitness (e.g., weight loss, strength)
    workoutExperience: "", // Experience with different types of workouts
    healthConditions: [], // Any pre-existing health conditions (e.g., back pain, knee issues)
    preferredWorkout: "", // Preferred types of workouts (e.g., cardio, yoga, strength)
    fitnessLevel: "", // User's current fitness level
  });

  const navigate = useNavigate();

  // Available workout preferences
  const workoutTypes = [
    "Yoga",
    "Cardio",
    "Strength Training",
    "HIIT",
    "Pilates",
    "CrossFit",
    "Endurance Training",
    "Rehabilitation",
    "Other",
  ];

  // Handle changes in the input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle changes for array input fields (like goals or health conditions)
  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.split(",").map((item) => item.trim()),
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post(
        "/fitnessForm", // Endpoint for saving fitness form data
        formData
      );
      toast.success(response.data.message); // Show success message
      navigate("/dashboard"); // Redirect to the dashboard after submission
    } catch (error) {
      const message =
        error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(message); // Show error message
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-semibold text-center">
        Fitness Profile Form
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        <div>
          <label
            htmlFor="age"
            className="block text-sm font-medium text-gray-700"
          >
            Age
          </label>
          <input
            type="number"
            name="age"
            id="age"
            value={formData.age}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter your age"
          />
        </div>

        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-gray-700"
          >
            Gender
          </label>
          <select
            name="gender"
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="fitnessGoals"
            className="block text-sm font-medium text-gray-700"
          >
            Fitness Goals (comma separated)
          </label>
          <input
            type="text"
            name="fitnessGoals"
            id="fitnessGoals"
            value={formData.fitnessGoals.join(", ")}
            onChange={handleArrayChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Weight loss, Strength, Flexibility"
          />
        </div>

        <div>
          <label
            htmlFor="workoutExperience"
            className="block text-sm font-medium text-gray-700"
          >
            Workout Experience
          </label>
          <input
            type="text"
            name="workoutExperience"
            id="workoutExperience"
            value={formData.workoutExperience}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="E.g., Beginner, Intermediate, Advanced"
          />
        </div>

        <div>
          <label
            htmlFor="healthConditions"
            className="block text-sm font-medium text-gray-700"
          >
            Health Conditions (comma separated)
          </label>
          <input
            type="text"
            name="healthConditions"
            id="healthConditions"
            value={formData.healthConditions.join(", ")}
            onChange={handleArrayChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Back pain, Knee injury"
          />
        </div>

        <div>
          <label
            htmlFor="preferredWorkout"
            className="block text-sm font-medium text-gray-700"
          >
            Preferred Type of Workout
          </label>
          <select
            name="preferredWorkout"
            id="preferredWorkout"
            value={formData.preferredWorkout}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a workout type</option>
            {workoutTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="fitnessLevel"
            className="block text-sm font-medium text-gray-700"
          >
            Fitness Level
          </label>
          <input
            type="text"
            name="fitnessLevel"
            id="fitnessLevel"
            value={formData.fitnessLevel}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="E.g., Beginner, Intermediate, Advanced"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md shadow-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FitnessForm;
