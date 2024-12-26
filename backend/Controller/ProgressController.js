const Progress = require("../model/progressSchema"); // Changed the model name

const { validationResult } = require("express-validator"); // Validation library

// Helper to handle async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// POST: Submit Health Progress Form
exports.submitHealthProgressForm = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  // Validate input using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    fitnessGoals,
    exerciseRoutine,
    yearsOfActivity,
    nutritionPlan,
    healthInterests,
    location,
  } = req.body;

  // Check if required fields are missing
  if (!exerciseRoutine || !yearsOfActivity || !nutritionPlan) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newHealthProgress = new Progress({
    user: userId,
    fitnessGoals,
    exerciseRoutine,
    yearsOfActivity,
    nutritionPlan,
    healthInterests,
    location,
  });

  // Save health progress data to database
  await newHealthProgress.save();

  res.status(201).json({
    message: "Health progress data submitted successfully",
    data: newHealthProgress,
  });
});

exports.getHealthProgressData = async (req, res) => {
  try {
    const userId = req.user.id; // Extract user ID from JWT payload
    const { page = 1, limit = 10, exerciseRoutine } = req.query;

    // Validate pagination inputs
    if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
      return res.status(400).json({
        success: false,
        message: "Pagination parameters must be positive numbers",
      });
    }

    // Filter by user and optional exerciseRoutine
    const filter = { user: userId };
    if (exerciseRoutine) filter.exerciseRoutine = exerciseRoutine;

    const healthProgressData = await Progress.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Progress.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Health progress data retrieved successfully",
      data: healthProgressData,
      totalCount: total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.editHealthProgressForm = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { progressId } = req.params; // Get progress ID from request params
  const {
    fitnessGoals,
    exerciseRoutine,
    yearsOfActivity,
    nutritionPlan,
    healthInterests,
    location,
  } = req.body;

  // Validate input using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Check if required fields are missing
  if (!exerciseRoutine || !yearsOfActivity || !nutritionPlan) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Find the Progress document by ID and user ID to ensure it's the correct user
  const progress = await Progress.findOne({ _id: progressId, user: userId });
  if (!progress) {
    return res
      .status(404)
      .json({ message: "Health progress data not found or access denied" });
  }

  // Update the health progress form with new data
  progress.fitnessGoals = fitnessGoals || progress.fitnessGoals;
  progress.exerciseRoutine = exerciseRoutine || progress.exerciseRoutine;
  progress.yearsOfActivity = yearsOfActivity || progress.yearsOfActivity;
  progress.nutritionPlan = nutritionPlan || progress.nutritionPlan;
  progress.healthInterests = healthInterests || progress.healthInterests;
  progress.location = location || progress.location;

  // Optionally, update the health level based on years of activity
  if (yearsOfActivity >= 5) {
    progress.healthLevel = "Advanced Fitness Enthusiast";
  } else if (yearsOfActivity >= 2) {
    progress.healthLevel = "Intermediate Fitness Enthusiast";
  } else {
    progress.healthLevel = "Beginner Fitness Enthusiast";
  }

  // Save updated health progress data
  await progress.save();

  res.status(200).json({
    message: "Health progress data updated successfully",
    data: progress,
  });
});
