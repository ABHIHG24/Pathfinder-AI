import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import axiosInstance from "../utils/api/axiosInstance"; // Update with your axios instance path

const CodeEditor = () => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("python");

  const handleRun = async () => {
    const trimmedCode = code.trim(); // Trim any leading/trailing whitespace or newline characters

    try {
      const response = await axiosInstance.post("/run", {
        language,
        code: trimmedCode,
      });
      // console.log(response);
      setOutput(response.data.output);
    } catch (error) {
      console.log(error);
      setOutput(error.response?.data?.output || "An error occurred");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <select
          className="select select-bordered w-40"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
        </select>
        <button className="btn btn-primary" onClick={handleRun}>
          Run Code
        </button>
      </div>

      <div className="editor-container h-96 border">
        <Editor
          height="100%"
          defaultLanguage={language}
          defaultValue="// Write your code here..."
          theme="vs-dark"
          onChange={(value) => setCode(value || "")}
        />
      </div>

      <div className="output-container mt-4 p-4 border bg-gray-100">
        <h2 className="text-xl font-bold mb-2">Output:</h2>
        <div
          className="bg-white border rounded-md p-2 max-h-40 overflow-hidden overflow-y-auto"
          style={{ fontFamily: "monospace", whiteSpace: "pre-wrap" }}
        >
          {output || "No output yet."}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
