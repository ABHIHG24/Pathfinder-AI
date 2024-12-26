const axios = require("axios");

const generateResponse = async (query) => {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.AI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `${query}`,
              },
            ],
          },
        ],
      }
    );

    // Parse the response to return a formatted answer

    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates.length > 0
    ) {
      const aiResponse = response.data.candidates[0].content;
      return aiResponse || "I couldn't fetch information about Virat Kohli.";
    } else {
      return "No relevant information found.";
    }
  } catch (error) {
    console.error("AI error:", error);
    return "Sorry, I couldn't process your request.";
  }
};

module.exports = { generateResponse };
