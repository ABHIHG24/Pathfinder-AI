import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/api/axiosInstance";
import { SingleCareer } from "../components";

const Dashboard = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [singleData, setSingleData] = useState(null); // Set initial state to null
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Added loading state

  // Fetch individual roadmap data
  const handleSubmit = async (id) => {
    console.log(id);
    try {
      setLoading(true); // Set loading before API call
      const response = await axiosInstance.get(`/user/dashboard/${id}`);
      console.log(response.data); // Log to check data structure
      setSingleData(response.data); // Update singleData when data is fetched
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      setError("Error fetching your personalized roadmap.");
    } finally {
      setLoading(false); // Reset loading after the call
    }
  };

  // Fetch all roadmaps for the user
  useEffect(() => {
    const fetchRoadmaps = async () => {
      setLoading(true); // Set loading before API call
      try {
        const response = await axiosInstance.get("/user/dashboard");
        if (response.data && response.data.selectedRoadmaps) {
          setRoadmaps(response.data.selectedRoadmaps);
        } else {
          setRoadmaps([]);
        }
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
        setError(
          "There was an issue fetching your personalized fitness roadmaps. Please try again later."
        );
      } finally {
        setLoading(false); // Reset loading after the call
      }
    };

    fetchRoadmaps();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">
          Loading your personalized roadmaps...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (roadmaps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">
          No personalized fitness roadmaps available. Please select a roadmap to
          start your fitness journey.
        </p>
      </div>
    );
  }

  return (
    <section className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Your Personalized Roadmaps
      </h2>

      {singleData ? (
        <SingleCareer
          roadmap={singleData.userSpecificRoadmap}
          ID={singleData.roadmapId}
          showSelectButton={false}
        />
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmaps.map((roadmap) => (
            <li
              key={roadmap.roadmapId?._id || roadmap._id}
              className="card shadow-md bg-primary-content"
            >
              <div className="card-body">
                <h3 className="card-title text-lg font-semibold">
                  {roadmap.userSpecificRoadmap?.careerTitle ||
                    "Untitled Roadmap"}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {roadmap.userSpecificRoadmap?.description
                    ? roadmap.userSpecificRoadmap?.description.slice(0, 50)
                    : "No description available"}
                  ...
                </p>
                <div
                  onClick={() => handleSubmit(roadmap.roadmapId)}
                  className="btn btn-primary btn-sm"
                >
                  View Roadmap
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Dashboard;
