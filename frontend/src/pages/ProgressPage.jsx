import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/api/axiosInstance";
import { useParams } from "react-router-dom";
import { SingleCareer } from "../components";

const ProgressPage = () => {
  const { id } = useParams();

  const [roadmap, setRoadmap] = useState(null);

  useEffect(() => {
    const fetchCareer = async () => {
      try {
        const response = await axiosInstance.get(`/roadmap/${id}`);
        setRoadmap(response.data);
      } catch (error) {
        console.error("Error fetching roadmap:", error);
      }
    };

    fetchCareer();
  }, [id]);

  if (!roadmap) return <p>Loading...</p>;

  return <SingleCareer roadmap={roadmap} showSelectButton={true} />;
};

export default ProgressPage;
