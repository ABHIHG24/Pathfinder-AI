const express = require("express");
const router = express.Router();
const roadmapController = require("../Controller/roadmapController");
const upload = require("../Middleware/multur");
const { restrict, isAuthenticatedUser } = require("../Middleware/auth");

// POST: Create a new roadmap
router.post(
  "/roadmap",
  upload.single("image"),
  roadmapController.createRoadmap
);

// GET: Retrieve all career roadmaps
router.get("/roadmaps", roadmapController.getAllRoadmaps);

// GET: Retrieve a single  roadmap by its ID
router.get("/roadmap/:id", roadmapController.getRoadmapById);

// PUT: Update a  roadmap by its ID
router.put("/roadmap/:id", roadmapController.updateRoadmap);

// DELETE: Delete a  roadmap by its ID
router.delete("/roadmap/:id", roadmapController.deleteRoadmap);

router.get(
  "/user/progress/:roadmapId",
  isAuthenticatedUser,
  roadmapController.getUserRoadmap
);

module.exports = router;
