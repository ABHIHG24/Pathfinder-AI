const multer = require("multer");
const Resource = require("../model/resourceSchema");

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Add a resource with optional file upload
const createResource = async (req, res) => {
  try {
    const { title, description, link, category } = req.body;
    const file = req.file ? req.file.filename : null; // Handle uploaded file

    const newResource = new Resource({
      title,
      description,
      link,
      category,
      file,
    });
    await newResource.save();
    res
      .status(201)
      .json({ message: "Resource added successfully", resource: newResource });
  } catch (error) {
    res.status(500).json({ message: "Error adding resource", error });
  }
};

// Fetch all resources
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resources", error });
  }
};

module.exports = { createResource, getResources, upload };
