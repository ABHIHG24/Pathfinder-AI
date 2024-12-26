import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/api/axiosInstance";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate

const TestComponent = () => {
  const location = useLocation();
  const topic = location.state?.topic || "General";
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 1 hour in seconds
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch questions before starting the test

  const cleanJSONData = (rawData) => {
    try {
      // console.log("Raw Data:", rawData);

      // Remove leading and trailing strings
      const startIndex = rawData.indexOf("[");
      const endIndex = rawData.lastIndexOf("]") + 1;

      // Extract JSON portion
      const jsonString = rawData.substring(startIndex, endIndex);

      // Parse JSON
      return JSON.parse(jsonString);
    } catch (error) {
      console.error("Error parsing JSON data:", error);
      return null;
    }
  };

  const fetchQuestions = async () => {
    setLoading(true); // Set loading to true when fetching questions
    try {
      const response = await axiosInstance.post(
        "/generate-questions",
        {
          topic: topic,
        },
        { timeout: 40000 } // Set timeout to 40 seconds
      );

      // Clean the fetched data as needed
      const cleanedData = cleanJSONData(response.data.questions);
      // console.log(cleanedData);
      // const parsedData = JSON.parse(cleanedData);
      // console.log("Cleaned Data:", cleanedData);

      setQuestions(cleanedData);
      setLoading(false); // Set loading to false after fetching questions
    } catch (error) {
      setLoading(false); // Set loading to false in case of error
      if (error.code === "ECONNABORTED") {
        toast.error("The request timed out. Please try again later.");
      } else {
        toast.error("Failed to fetch questions. Please try again.");
      }
      console.error("Error fetching questions:", error);
    }
  };

  // Start the test
  const startTest = () => {
    setTestStarted(true);
    fetchQuestions();
  };

  // Timer countdown
  useEffect(() => {
    if (testStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      submitTest(); // Automatically submit when time is up
    }
  }, [testStarted, timeLeft]);

  // Handle user answers
  const handleAnswerChange = (index, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [index]: answer, // Use index to store the answer for each question
    }));
  };

  // Submit the test and calculate results
  const submitTest = async () => {
    setTestStarted(false);
    setTestCompleted(true);

    // Calculate the result by comparing user answers with the correct answers using the index
    const calculatedResult = questions.map((question, index) => {
      const userAnswer = userAnswers[index]?.trim().toLowerCase(); // Normalize answer
      const correctAnswer = question.correct_answer?.trim().toLowerCase(); // Normalize correct answer

      const extractedUserAnswer = userAnswer
        ? userAnswer.split(")")[0].trim()
        : "";

      const isCorrect = extractedUserAnswer === correctAnswer; // Compare if the answer is correct

      return {
        questionText: question.question,
        userAnswer,
        correctAnswer,
        reason: question.reason,
        isCorrect,
      };
    });
    // console.log(calculatedResult, "jjhjj");

    // Calculate the score by counting the number of correct answers
    const score = calculatedResult.filter((item) => item.isCorrect).length;

    setResult({
      score,
      total: questions.length,
      questions: calculatedResult,
    });
  };

  // Format time for display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Result display
  if (testCompleted && result) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Test Results</h1>
        <p>
          Score: {result.score} / {result.total}
        </p>
        <ul>
          {result.questions?.map((question, index) => (
            <li key={index} className="mb-4">
              <p>
                <strong>Q: {question.questionText}</strong>
              </p>
              <p>Your Answer: {question.userAnswer}</p>
              <p>Correct Answer: {question.correctAnswer}</p>
              <p>Reason: {question.reason}</p>
            </li>
          ))}
        </ul>
        <button
          onClick={() => navigate("/career")} // Navigate to Career link
          className="btn btn-primary mt-4"
        >
          Go to Career
        </button>
      </div>
    );
  }

  return (
    <div>
      {!testStarted && !testCompleted && (
        <div>
          <h1 className="text-2xl font-bold">Test Instructions</h1>
          <p className="mt-4">
            This test contains 20 questions and has a time limit of 30 mins.
            Your progress will be automatically submitted when the time is up.
          </p>
          <button
            onClick={startTest}
            className="btn btn-primary mt-4"
            disabled={loading} // Disable button while loading
          >
            {loading ? (
              <span className="loading loading-dots loading-xs"></span> // DaisyUI Loader
            ) : (
              "Start Test"
            )}
          </button>
        </div>
      )}

      {testStarted && (
        <div>
          <h1 className="text-2xl font-bold">Test in Progress</h1>
          <p className="mt-2 text-lg">Time Left: {formatTime(timeLeft)}</p>
          {loading ? (
            <div className="flex justify-center items-center mt-4">
              <div className="loading loading-spinner loading-lg"></div>
              <p className="ml-2">Loading questions...</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitTest();
              }}
            >
              {questions?.map((question, index) => (
                <div key={index} className="mb-4">
                  <p>
                    <strong>
                      {index + 1}. {question.question}
                    </strong>
                  </p>
                  <div>
                    {question.options?.map((option, optIndex) => (
                      <label key={optIndex} className="block">
                        <input
                          type="radio"
                          name={index}
                          value={option}
                          onChange={() => handleAnswerChange(index, option)}
                          className="mr-2"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <button type="submit" className="btn btn-success mt-4">
                Submit Test
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default TestComponent;
