import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, Outlet } from "react-router-dom";

const DisplayResources = () => {
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get(
          "https://pathfinder-ai.onrender.com/api/resources"
        );
        // console.log(response.data);
        setResources(response.data);
      } catch (error) {
        console.error("Error fetching resources", error);
      }
    };
    fetchResources();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <NavLink to="ResumeForm" className="mb-4">
        <button className="btn btn-info">Generate Resume</button>
      </NavLink>
      <NavLink to="CodeEditor" className="mb-4 ml-2">
        <button className="btn btn-info">CodeEditor Coder</button>
      </NavLink>
      <h1 className="text-3xl font-bold mb-6 text-center text-success">
        Resources
      </h1>

      {resources.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div
              key={resource._id}
              className="card neutral-content shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-lg overflow-hidden"
            >
              <div className="card-body p-4">
                <h2 className="card-title text-lg font-semibold">
                  {resource.title}
                </h2>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <div className="flex flex-col gap-2">
                  {resource.link && (
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-link text-primary hover:underline"
                    >
                      Visit External Link
                    </a>
                  )}
                  {resource.file && (
                    <a
                      href={`https://pathfinder-ai.onrender.com/uploads/${resource.file}`}
                      download
                      className="btn btn-link text-green-600 hover:underline"
                    >
                      Download File
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  Category:{" "}
                  <span className="font-medium">{resource.category}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No resources found.</p>
      )}
    </div>
  );
};

export default DisplayResources;
