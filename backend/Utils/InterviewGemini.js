const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const express = require("express");
const router = express.Router();

const apiKey = process.env.AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Endpoint to generate questions
router.post("/generate-questions", async (req, res) => {
  const inputText = req.body.topic;

  try {
    // Start chat session
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: "Create a set of 20 choice questions based on the input. Include a clear question, 4 options (A, B, C, D), and specify the correct answer. Ensure the questions cover important concepts. Provide answers in JSON format with question, options, and correct answer keys.  and secify the reason for the correct input\nonly five questions options and reason in json format nothing else \nit shoud be 20 question ",
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: '```json\n[\n    {\n        "question": "What is the primary function of the cell membrane?",\n        "options": ["A) DNA storage", "B) Protein synthesis", "C) Regulating what enters and exits the cell", "D) Energy production"],\n         "correct_answer": "C",\n         "reason": "The cell membrane acts as a selective barrier, controlling the movement of substances in and out of the cell."\n    },\n    {\n        "question": "Which organelle is responsible for generating most of the cell\'s ATP?",\n        "options": ["A) Endoplasmic reticulum", "B) Golgi apparatus", "C) Nucleus", "D) Mitochondria"],\n        "correct_answer": "D",\n        "reason": "Mitochondria are the powerhouses of the cell, performing cellular respiration to produce ATP."\n    },\n    {\n       "question": "What is the role of ribosomes in a cell?",\n        "options": ["A) Lipid synthesis", "B) Protein synthesis", "C) Waste disposal", "D) DNA replication"],\n        "correct_answer": "B",\n        "reason":"Ribosomes are the site of protein synthesis, translating mRNA into polypeptides."\n    },\n    {\n        "question": "Which of the following is NOT a component of the cell theory?",\n        "options": ["A) All living things are made of cells", "B) Cells are the basic units of structure and function in organisms", "C) All cells are created from non-living matter", "D) All cells come from pre-existing cells"],\n        "correct_answer": "C",\n         "reason": "The cell theory states that all cells arise from pre-existing cells, not from non-living matter."\n    },\n   {\n        "question": "What is the main function of the nucleus?",\n        "options":["A) Protein modification", "B) Lipid storage","C) Contains genetic material", "D) Cellular digestion"],\n        "correct_answer": "C",\n        "reason":"The nucleus is responsible for storing and protecting the cell\'s DNA."\n    },\n   {\n        "question": "What is the purpose of the Golgi apparatus?",\n        "options": ["A) Protein synthesis", "B) Packaging and modification of proteins", "C) Energy production", "D) DNA replication"],\n        "correct_answer": "B",\n        "reason": "The Golgi apparatus processes and packages proteins for transport within or outside the cell."\n   },\n  {\n        "question": "Which molecule is the primary source of energy for cells?",\n         "options": ["A) Protein", "B) Glucose", "C) Lipid", "D) DNA"],\n        "correct_answer": "B",\n        "reason": "Glucose is a simple sugar that is broken down through cellular respiration to produce ATP."\n   },\n    {\n         "question": "What is the process by which cells divide to create two identical daughter cells?",\n         "options": ["A) Meiosis", "B) Osmosis", "C) Mitosis", "D) Diffusion"],\n         "correct_answer": "C",\n         "reason": "Mitosis is the process of cell division that results in two genetically identical daughter cells."\n    },\n     {\n        "question":"What type of cell division is used for sexual reproduction?",\n         "options": ["A) Mitosis", "B) Meiosis", "C) Binary fission", "D) Simple diffusion"],\n         "correct_answer": "B",\n        "reason": "Meiosis is the process of cell division used to create gametes (sex cells) with half the number of chromosomes."\n    },\n     {\n        "question": "What is the process where water moves across a semi-permeable membrane from a region of high concentration to a region of low concentration?",\n        "options": ["A) Active transport", "B) Diffusion", "C) Osmosis", "D) Facilitated diffusion"],\n        "correct_answer": "C",\n         "reason": "Osmosis specifically refers to the movement of water across a semi-permeable membrane."\n    },\n  {\n        "question": "Which molecule is known as the \'genetic blueprint\' of a cell?",\n        "options": ["A) RNA", "B) Protein", "C) DNA", "D) Lipid"],\n        "correct_answer": "C",\n        "reason": "DNA stores the genetic information that is passed on during cell division."\n    },\n   {\n        "question":"Which of the following best describes the function of lysosomes?",\n        "options": ["A) Protein folding", "B) Protein synthesis", "C) Cellular digestion", "D) Lipid production"],\n        "correct_answer": "C",\n        "reason": "Lysosomes contain enzymes that break down cellular waste and debris."\n    },\n    {\n        "question": "What is the main function of the endoplasmic reticulum (ER)?",\n         "options": ["A) DNA storage", "B) Protein and lipid synthesis and transport", "C) Cell division", "D) Energy production"],\n         "correct_answer": "B",\n        "reason": "The ER is involved in the synthesis and transport of various cellular components, including proteins and lipids."\n    },\n    {\n         "question": "Which process allows cells to take in large molecules or particles by engulfing them?",\n          "options": ["A) Diffusion", "B) Exocytosis", "C) Endocytosis", "D) Osmosis"],\n          "correct_answer": "C",\n          "reason":"Endocytosis is a process where cells take in external substances by engulfing them within a membrane vesicle."\n    },\n    {\n        "question": "What is the function of enzymes in cellular processes?",\n         "options": ["A) To store genetic information", "B) To speed up chemical reactions", "C) To transport molecules across membranes", "D) To provide structure to the cell"],\n         "correct_answer":"B",\n         "reason":"Enzymes are biological catalysts that speed up specific chemical reactions in cells."\n    },\n    {\n         "question": "What is the term for the process where a cell releases molecules to the outside?",\n          "options": ["A) Endocytosis", "B) Phagocytosis", "C) Exocytosis", "D) Pinocytosis"],\n          "correct_answer": "C",\n          "reason": "Exocytosis is the process by which cells release substances to the extracellular environment."\n    },\n    {\n        "question": "Which of these is NOT a type of cell transport?",\n        "options": ["A) Osmosis", "B) Diffusion", "C) Photosynthesis", "D) Active transport"],\n        "correct_answer": "C",\n        "reason": "Photosynthesis is a process for creating energy, not a method of cell transport."\n     },\n     {\n          "question": "What does the term \'organelle\' refer to in a cell?",\n        "options": ["A) The cell membrane", "B) A small functional structure inside the cell", "C) The fluid in the cell", "D) The genetic material"],\n        "correct_answer":"B",\n        "reason": "Organelles are specialized structures within a cell that perform specific functions."\n    },\n   {\n         "question": "What is the role of chloroplasts in plant cells?",\n         "options": ["A) Protein synthesis", "B) Cellular respiration", "C) Photosynthesis", "D) Waste removal"],\n         "correct_answer":"C",\n         "reason":"Chloroplasts are the organelles responsible for photosynthesis, converting light energy into chemical energy in plant cells."\n   },\n     {\n          "question":"What is a gene?",\n        "options":["A) A protein molecule","B) A unit of heredity","C) A type of cell membrane","D) A structure in the mitochondria"],\n         "correct_answer":"B",\n         "reason": "A gene is a unit of heredity that encodes specific traits."\n    }\n]\n```',
            },
          ],
        },
      ],
    });
    const result = await chatSession.sendMessage(inputText);
    // console.log(result.response.text());
    res.json({ questions: result.response.text() });
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

module.exports = router;
