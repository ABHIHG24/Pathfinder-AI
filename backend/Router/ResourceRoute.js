const express = require("express");
const {
  createResource,
  getResources,
  upload,
} = require("../Controller/ResourceController");
const router = express.Router();

// Add a resource
router.post("/add", upload.single("file"), createResource);

// Get all resources
router.get("/", getResources);

module.exports = router;
