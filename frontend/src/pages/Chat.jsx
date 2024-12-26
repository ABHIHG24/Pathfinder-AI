import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [responses, setResponses] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInput.trim()) return;

    const newResponse = {
      user: userInput,
      ai: "Thinking...",
    };
    setResponses([...responses, newResponse]);
    setUserInput(""); // Reset input

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        query: userInput,
      });
      const aiResponse = res.data.message.parts[0].text;
      setResponses((prev) => [
        ...prev.slice(0, prev.length - 1),
        { user: newResponse.user, ai: aiResponse },
      ]);
    } catch (err) {
      console.error("Error:", err);
      setResponses((prev) => [
        ...prev.slice(0, prev.length - 1),
        { user: newResponse.user, ai: "Error occurred!" },
      ]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-100 via-white to-gray-200 py-6 px-4">
      <div className="w-full max-w-5xl  bg-white shadow-md rounded-lg p-6 flex  space-y-6">
        {/* Chat Output */}
        <div className="w-full space-y-4 h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-gray-200">
          <h1 className="text-2xl font-bold text-blue-600 text-center mb-6">
            AI Teacher Chatbot
          </h1>

          {/* Displaying responses */}
          {responses.map((r, index) => (
            <div key={index} className="space-y-3">
              {/* User Message */}
              <div className="flex justify-start">
                <div className="bg-blue-100 p-3 rounded-lg max-w-[70%] text-blue-900 text-sm shadow-md">
                  <span className="font-semibold">You:</span> {r.user}
                </div>
              </div>

              {/* AI Response */}
              <div className="flex justify-end">
                <div className="bg-gray-100 p-3 rounded-lg max-w-[70%] text-gray-800 text-sm shadow-md">
                  <span className="font-semibold">AI:</span> {r.ai}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Image above Input */}
        <div className="flex flex-col justify-center items-center space-y-4">
          <img
            src="https://www.revechat.com/wp-content/uploads/2016/09/cb-hero-top.webp"
            alt="Health AI"
            className="w-40 h-40 object-contain rounded-full border-4 border-blue-500 shadow-lg"
          />

          {/* Input and Button */}
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask something..."
              className="w-full p-3 text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="w-full py-3 text-sm bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 focus:ring-4 focus:ring-blue-300"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
