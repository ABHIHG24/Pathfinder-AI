const { generateResponse } = require("../gemini.js");

// Chatbot response logic
const getChatbotResponse = async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ message: "Query is required!" });
  }

  try {
    const aiResponse = await generateResponse(query);
    return res.status(200).json({ message: aiResponse });
  } catch (error) {
    console.error("Error in getting response:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getChatbotResponse };
