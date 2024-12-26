import React, { useState } from "react";
import axiosInstance from "../utils/api/axiosInstance";

const ResumeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    summary: "",
    workExperience: [],
    academicHistory: [],
    contact: {
      phone: "",
      email: "",
      address: "",
      portfolio: "",
    },
    certifications: [],
  });

  // Handlers for Dynamic Sections
  const addWorkExperience = () => {
    setFormData({
      ...formData,
      workExperience: [
        ...formData.workExperience,
        { title: "", location: "", timeline: "", description: [""] },
      ],
    });
  };

  const removeWorkExperience = (index) => {
    setFormData({
      ...formData,
      workExperience: formData.workExperience.filter((_, i) => i !== index),
    });
  };

  const addAcademicHistory = () => {
    setFormData({
      ...formData,
      academicHistory: [
        ...formData.academicHistory,
        { college: "", description: "" },
      ],
    });
  };

  const removeAcademicHistory = (index) => {
    setFormData({
      ...formData,
      academicHistory: formData.academicHistory.filter((_, i) => i !== index),
    });
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [...formData.certifications, { name: "", link: "" }],
    });
  };

  const removeCertification = (index) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index),
    });
  };

  // Handler for submitting the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/generate-pdf", formData, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();
    } catch (error) {
      console.error("Error generating resume:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto"
      >
        <h1 className="text-2xl font-bold mb-6">Dynamic Resume Builder</h1>

        {/* Name and Summary */}
        <div className="form-control mb-4">
          <label className="label">Full Name</label>
          <input
            type="text"
            className="input input-bordered"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="form-control mb-4">
          <label className="label">Professional Summary</label>
          <textarea
            className="textarea textarea-bordered"
            value={formData.summary}
            onChange={(e) =>
              setFormData({ ...formData, summary: e.target.value })
            }
          ></textarea>
        </div>

        {/* Work Experience */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Work Experience</h2>
          {formData.workExperience.map((exp, index) => (
            <div key={index} className="mb-4 border p-4 rounded-md">
              <input
                type="text"
                placeholder="Job Title"
                className="input input-bordered w-full mb-2"
                value={exp.title}
                onChange={(e) => {
                  const newWork = [...formData.workExperience];
                  newWork[index].title = e.target.value;
                  setFormData({ ...formData, workExperience: newWork });
                }}
              />
              <input
                type="text"
                placeholder="Location"
                className="input input-bordered w-full mb-2"
                value={exp.location}
                onChange={(e) => {
                  const newWork = [...formData.workExperience];
                  newWork[index].location = e.target.value;
                  setFormData({ ...formData, workExperience: newWork });
                }}
              />
              <input
                type="text"
                placeholder="Timeline"
                className="input input-bordered w-full mb-2"
                value={exp.timeline}
                onChange={(e) => {
                  const newWork = [...formData.workExperience];
                  newWork[index].timeline = e.target.value;
                  setFormData({ ...formData, workExperience: newWork });
                }}
              />
              <textarea
                placeholder="Description"
                className="textarea textarea-bordered w-full"
                value={exp.description}
                onChange={(e) => {
                  const newWork = [...formData.workExperience];
                  newWork[index].description = [e.target.value];
                  setFormData({ ...formData, workExperience: newWork });
                }}
              ></textarea>
              <button
                type="button"
                onClick={() => removeWorkExperience(index)}
                className="btn btn-error mt-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addWorkExperience}
            className="btn btn-secondary"
          >
            Add Work Experience
          </button>
        </div>

        {/* Academic History */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Academic History</h2>
          {formData.academicHistory.map((academic, index) => (
            <div key={index} className="mb-4 border p-4 rounded-md">
              <input
                type="text"
                placeholder="College Name"
                className="input input-bordered w-full mb-2"
                value={academic.college}
                onChange={(e) => {
                  const newAcademic = [...formData.academicHistory];
                  newAcademic[index].college = e.target.value;
                  setFormData({ ...formData, academicHistory: newAcademic });
                }}
              />
              <textarea
                placeholder="Description"
                className="textarea textarea-bordered w-full"
                value={academic.description}
                onChange={(e) => {
                  const newAcademic = [...formData.academicHistory];
                  newAcademic[index].description = e.target.value;
                  setFormData({ ...formData, academicHistory: newAcademic });
                }}
              ></textarea>
              <button
                type="button"
                onClick={() => removeAcademicHistory(index)}
                className="btn btn-error mt-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addAcademicHistory}
            className="btn btn-secondary"
          >
            Add Academic History
          </button>
        </div>

        {/* Contact Details */}
        <div className="form-control mb-6">
          <label className="label">Phone</label>
          <input
            type="text"
            className="input input-bordered"
            value={formData.contact.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                contact: { ...formData.contact, phone: e.target.value },
              })
            }
            required
          />
          <label className="label">Email</label>
          <input
            type="email"
            className="input input-bordered"
            value={formData.contact.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                contact: { ...formData.contact, email: e.target.value },
              })
            }
            required
          />
          <label className="label">Address</label>
          <textarea
            className="textarea textarea-bordered"
            value={formData.contact.address}
            onChange={(e) =>
              setFormData({
                ...formData,
                contact: { ...formData.contact, address: e.target.value },
              })
            }
          ></textarea>
          <label className="label">Portfolio (Optional)</label>
          <input
            type="url"
            className="input input-bordered"
            value={formData.contact.portfolio}
            onChange={(e) =>
              setFormData({
                ...formData,
                contact: { ...formData.contact, portfolio: e.target.value },
              })
            }
          />
        </div>

        {/* Certifications */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Certifications</h2>
          {formData.certifications.map((cert, index) => (
            <div key={index} className="mb-4 border p-4 rounded-md">
              <input
                type="text"
                placeholder="Certification Name"
                className="input input-bordered w-full mb-2"
                value={cert.name}
                onChange={(e) => {
                  const newCert = [...formData.certifications];
                  newCert[index].name = e.target.value;
                  setFormData({ ...formData, certifications: newCert });
                }}
              />
              <input
                type="url"
                placeholder="Certification Link"
                className="input input-bordered w-full"
                value={cert.link}
                onChange={(e) => {
                  const newCert = [...formData.certifications];
                  newCert[index].link = e.target.value;
                  setFormData({ ...formData, certifications: newCert });
                }}
              />
              <button
                type="button"
                onClick={() => removeCertification(index)}
                className="btn btn-error mt-2"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addCertification}
            className="btn btn-secondary"
          >
            Add Certification
          </button>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-full mt-4">
          Generate Resume
        </button>
      </form>
    </div>
  );
};

export default ResumeForm;
