import React, { useState } from "react";
import axios from "axios";

function CreateRoadmap() {
  const [Title, setTitle] = useState(""); // Changed from careerTitle to Title
  const [description, setDescription] = useState("");
  const [roadmapSteps, setRoadmapSteps] = useState([
    {
      stepTitle: "",
      stepDescription: "",
      resources: [{ title: "", link: "", type: "video" }],
    },
  ]);
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setError("");
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...roadmapSteps];
    updatedSteps[index][field] = value;
    setRoadmapSteps(updatedSteps);
  };

  const handleResourceChange = (stepIndex, resourceIndex, field, value) => {
    const updatedSteps = [...roadmapSteps];
    updatedSteps[stepIndex].resources[resourceIndex][field] = value;
    setRoadmapSteps(updatedSteps);
  };

  const addResource = (stepIndex) => {
    const updatedSteps = [...roadmapSteps];
    updatedSteps[stepIndex].resources.push({
      title: "",
      link: "",
      type: "video",
    });
    setRoadmapSteps(updatedSteps);
  };

  const removeResource = (stepIndex, resourceIndex) => {
    const updatedSteps = [...roadmapSteps];
    updatedSteps[stepIndex].resources = updatedSteps[
      stepIndex
    ].resources.filter((_, i) => i !== resourceIndex);
    setRoadmapSteps(updatedSteps);
  };

  const addStep = () => {
    setRoadmapSteps([
      ...roadmapSteps,
      {
        stepTitle: "",
        stepDescription: "",
        resources: [{ title: "", link: "", type: "video" }],
      },
    ]);
  };

  const removeStep = (index) => {
    setRoadmapSteps(roadmapSteps.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!Title || !description || !image) {
      setError("All fields are required, including an image.");
      return;
    }

    const formData = new FormData();
    formData.append("careerTitle", Title);
    formData.append("description", description);
    formData.append("roadmapSteps", JSON.stringify(roadmapSteps));
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/roadmap/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccessMessage("Roadmap created successfully!");
      setError("");
      console.log(response.data);
    } catch (error) {
      console.error("Error creating roadmap", error);
      setError("Failed to create roadmap. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-3xl mx-auto bg-white p-8 shadow-xl rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-6 text-primary">
          Create Roadmap
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-center mb-4">{successMessage}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label font-semibold">Title</label>
            <input
              type="text"
              placeholder="Enter the title"
              value={Title} // Changed from careerTitle to Title
              onChange={(e) => setTitle(e.target.value)} // Changed from setCareerTitle to setTitle
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control">
            <label className="label font-semibold">Description</label>
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea textarea-bordered w-full"
              required
            />
          </div>
          <h3 className="text-lg font-bold mt-6">Roadmap Steps</h3>
          {roadmapSteps.map((step, stepIndex) => (
            <div key={stepIndex} className="bg-gray-100 p-4 rounded-lg mb-4">
              <div className="form-control">
                <label className="label font-semibold">{`Step ${
                  stepIndex + 1
                } Title`}</label>
                <input
                  type="text"
                  placeholder={`Enter title for Step ${stepIndex + 1}`}
                  value={step.stepTitle}
                  onChange={(e) =>
                    handleStepChange(stepIndex, "stepTitle", e.target.value)
                  }
                  className="input input-bordered w-full"
                  required
                />
              </div>
              <div className="form-control mt-2">
                <label className="label font-semibold">{`Step ${
                  stepIndex + 1
                } Description`}</label>
                <textarea
                  placeholder={`Enter description for Step ${stepIndex + 1}`}
                  value={step.stepDescription}
                  onChange={(e) =>
                    handleStepChange(
                      stepIndex,
                      "stepDescription",
                      e.target.value
                    )
                  }
                  className="textarea textarea-bordered w-full"
                  required
                />
              </div>
              <h4 className="text-md font-bold mt-4">Resources</h4>
              {step.resources.map((resource, resourceIndex) => (
                <div
                  key={resourceIndex}
                  className="bg-white p-3 rounded-lg mb-3 border"
                >
                  <div className="form-control">
                    <label className="label">Resource Title</label>
                    <input
                      type="text"
                      placeholder="Enter resource title"
                      value={resource.title}
                      onChange={(e) =>
                        handleResourceChange(
                          stepIndex,
                          resourceIndex,
                          "title",
                          e.target.value
                        )
                      }
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="form-control mt-2">
                    <label className="label">Resource Link</label>
                    <input
                      type="url"
                      placeholder="Enter resource link"
                      value={resource.link}
                      onChange={(e) =>
                        handleResourceChange(
                          stepIndex,
                          resourceIndex,
                          "link",
                          e.target.value
                        )
                      }
                      className="input input-bordered w-full"
                      required
                    />
                  </div>
                  <div className="form-control mt-2">
                    <label className="label">Resource Type</label>
                    <select
                      value={resource.type}
                      onChange={(e) =>
                        handleResourceChange(
                          stepIndex,
                          resourceIndex,
                          "type",
                          e.target.value
                        )
                      }
                      className="select select-bordered w-full"
                      required
                    >
                      <option value="video">Video</option>
                      <option value="article">Article</option>
                      <option value="book">Book</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeResource(stepIndex, resourceIndex)}
                    className="btn btn-error btn-sm mt-2"
                  >
                    Remove Resource
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addResource(stepIndex)}
                className="btn btn-accent btn-sm mt-2"
              >
                Add Resource
              </button>
              {roadmapSteps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(stepIndex)}
                  className="btn btn-error btn-sm mt-4"
                >
                  Remove Step
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="btn btn-accent w-full"
          >
            Add Step
          </button>
          <div className="form-control mt-4">
            <label className="label font-semibold">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full mt-4">
            Create Roadmap
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateRoadmap;
