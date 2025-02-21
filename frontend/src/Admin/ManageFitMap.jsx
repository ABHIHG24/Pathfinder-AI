import { useState, useEffect } from "react";
import axiosInstance from "../utils/api/axiosInstance";
import { FaTrashAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const ManageFitMap = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  // Fetch all roadmaps
  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const { data } = await axiosInstance.get("/roadmaps");
        setRoadmaps(data.roadmaps); // Assuming `data.roadmaps` contains the list of roadmaps
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
        toast.error("Error fetching roadmaps!");
        setIsLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  // Handle roadmap deletion
  const deleteRoadmap = async (id) => {
    try {
      await axiosInstance.delete(`/roadmap/${id}`);
      setRoadmaps((prevRoadmaps) =>
        prevRoadmaps.filter((roadmap) => roadmap._id !== id)
      );
      toast.success("Roadmap deleted successfully!");
    } catch (error) {
      console.error("Error deleting roadmap:", error);
      toast.error("Error deleting roadmap!");
    }
  };

  // Fetch a single roadmap (view)
  const viewRoadmap = async (id) => {
    try {
      const { data } = await axiosInstance.get(`/roadmap/${id}`);
      console.log(data); // Log the response to check the data structure
      setSelectedRoadmap(data.roadmap); // Set selected roadmap data for the modal
    } catch (error) {
      console.error("Error fetching roadmap:", error);
      toast.error("Error fetching roadmap!");
    }
  };

  if (isLoading) {
    return <h1 className="text-center text-2xl">Loading roadmaps...</h1>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Manage Roadmaps</h1>

      {/* Roadmaps Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roadmaps.map((roadmap, index) => (
              <tr key={roadmap._id}>
                <td>{index + 1}</td>
                <td className="text-primary">{roadmap.careerTitle}</td>
                <td>{roadmap.description || "No description available"}</td>
                <td className="flex gap-2">
                  {/* Delete button */}
                  <button
                    className="btn btn-sm btn-error"
                    onClick={() => deleteRoadmap(roadmap._id)}
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Roadmap Modal */}
      {selectedRoadmap && (
        <div className="modal modal-open">
          <div className="modal-box w-full max-w-4xl">
            <h3 className="font-bold text-lg">{selectedRoadmap.Title}</h3>
            <p className="py-4">
              {selectedRoadmap.description || "No description available"}
            </p>
            <div className="py-4">
              <h4 className="font-semibold text-lg">Roadmap Steps</h4>
              {selectedRoadmap.steps && selectedRoadmap.steps.length > 0 ? (
                <ul className="space-y-2">
                  {selectedRoadmap.steps.map((step, index) => (
                    <li key={index} className="border p-3 rounded-md">
                      <h5 className="font-bold">{step.stepTitle}</h5>
                      <p>{step.stepDescription}</p>
                      <div>
                        <h6 className="font-semibold">Resources:</h6>
                        <ul className="space-y-1">
                          {step.resources && step.resources.length > 0 ? (
                            step.resources.map((resource, i) => (
                              <li key={i}>
                                <a
                                  href={resource.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:underline"
                                >
                                  {resource.title} ({resource.type})
                                </a>
                              </li>
                            ))
                          ) : (
                            <p>No resources available</p>
                          )}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No steps available for this roadmap.</p>
              )}
            </div>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={() => setSelectedRoadmap(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFitMap;
