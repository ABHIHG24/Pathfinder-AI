const express = require("express");
const router = express.Router();
const progressController = require("../Controller/ProgressController");
const { restrict, isAuthenticatedUser } = require("../Middleware/auth");

// POST: Submit health progress form
router.post(
  "/progress",
  isAuthenticatedUser,
  progressController.submitHealthProgressForm
);

// GET: Retrieve health progress data
router.get(
  "/progress",
  isAuthenticatedUser,
  progressController.getHealthProgressData
);

// PUT: Edit health progress data
router.put(
  "/progress/:progressId",
  isAuthenticatedUser,
  progressController.editHealthProgressForm
);

module.exports = router;
