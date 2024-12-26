const express = require("express");
const { getChatbotResponse } = require("../Genimi/chatbotController.js");
const router = express.Router();

router.post("/", getChatbotResponse); // Endpoint to handle chat requests

module.exports = router;
