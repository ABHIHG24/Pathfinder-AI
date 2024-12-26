import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddResource = () => {
  const [resource, setResource] = useState({
    title: "",
    description: "",
    link: "",
    category: "",
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResource({ ...resource, [name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", resource.title);
      formData.append("description", resource.description);
      formData.append("link", resource.link);
      formData.append("category", resource.category);
      if (file) formData.append("file", file);

      await axios.post("http://localhost:5000/api/resources/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Resource added successfully!");
      setResource({ title: "", description: "", link: "", category: "" });
      setFile(null);
    } catch (error) {
      toast.error("Failed to add resource");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add Resource</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          value={resource.title}
          onChange={handleChange}
          placeholder="Title"
          className="input input-bordered"
        />
        <textarea
          name="description"
          value={resource.description}
          onChange={handleChange}
          placeholder="Description"
          className="textarea textarea-bordered"
        ></textarea>
        <input
          type="text"
          name="link"
          value={resource.link}
          onChange={handleChange}
          placeholder="External Link (Optional)"
          className="input input-bordered"
        />
        <input
          type="text"
          name="category"
          value={resource.category}
          onChange={handleChange}
          placeholder="Category"
          className="input input-bordered"
        />
        <input
          type="file"
          onChange={handleFileChange}
          className="file-input file-input-bordered"
        />
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddResource;
