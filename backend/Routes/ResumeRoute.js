const express = require("express");
const { generateResume } = require("../Controller/resumeController");

const router = express.Router();

// POST route to generate resume
router.post("/generate-pdf", generateResume);

module.exports = router;
