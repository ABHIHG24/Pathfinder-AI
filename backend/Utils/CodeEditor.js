const express = require("express");
const { exec } = require("child_process"); // Import exec from child_process
const fs = require("fs");
const { v4: uuidv4 } = require("uuid"); // For generating unique temporary filenames
const router = express.Router();
const os = require("os");

router.post("/run", (req, res) => {
  const { language, code } = req.body;
  console.log(req.body);
  if (!language || !code) {
    return res.status(400).send({ output: "Language and code are required." });
  }

  const trimmedCode = code.trim(); // Trim whitespace from the code
  // console.log(`Executing code in ${language}:`, trimmedCode);

  const executeCode = (cmd, tempFilename) => {
    exec(cmd, (error, stdout, stderr) => {
      if (tempFilename && fs.existsSync(tempFilename)) {
        fs.unlinkSync(tempFilename); // Cleanup the temporary file
      }
      if (error) {
        console.error("Execution error:", error);
        return res.status(400).send({ output: stderr });
      }
      res.send({ output: stdout + stderr });
    });
  };

  const isWindows = os.platform() === "win32";

  switch (language) {
    case "python": {
      const tempFilename = `temp-${uuidv4()}.py`;
      fs.writeFileSync(tempFilename, trimmedCode);
      executeCode(`python ${tempFilename}`, tempFilename);
      break;
    }
    case "c": {
      const tempFilename = `temp-${uuidv4()}.c`;
      fs.writeFileSync(tempFilename, trimmedCode);
      // Windows systems require the .exe extension
      const cmd = isWindows
        ? `gcc ${tempFilename} -o temp.exe && temp.exe`
        : `gcc ${tempFilename} -o temp && ./temp`;
      executeCode(cmd, tempFilename);
      break;
    }
    case "cpp": {
      const tempFilename = `temp-${uuidv4()}.cpp`;
      fs.writeFileSync(tempFilename, trimmedCode);
      executeCode(`g++ ${tempFilename} -o temp && temp`, tempFilename);
      break;
    }
    case "javascript": {
      // Clean the JavaScript code by removing unnecessary line breaks and escaping
      const cleanCode = trimmedCode
        .replace(/\r\n|\n|\r/g, " ")
        .replace(/\s+/g, " "); // Flatten the code to a single line
      const cmd = `node -e "${cleanCode}"`; // Ensure clean code is passed to node
      console.log(`Executing code in javascript: ${cmd}`);
      executeCode(cmd, res);
      break;
    }
    default: {
      res.status(400).send({ output: "Language not supported." });
      break;
    }
  }
});

module.exports = router;
