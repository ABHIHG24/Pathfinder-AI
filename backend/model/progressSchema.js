const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference the User model
    required: true,
  },
  fitnessGoals: [
    {
      type: String,
      required: true,
    },
  ],
  exerciseRoutine: {
    type: String,
    enum: [
      "Yoga",
      "Cardio",
      "Strength Training",
      "HIIT",
      "Pilates",
      "CrossFit",
      "Endurance Training",
      "Sports-Specific Training",
      "Rehabilitation",
      "Other",
    ],
    required: true,
  },
  yearsOfActivity: {
    type: Number,
    required: true,
  },
  nutritionPlan: {
    type: String,
    required: true,
  },
  healthInterests: [
    {
      type: String,
      required: true,
    },
  ],
  location: {
    type: String,
    required: true,
  },
  healthLevel: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to set healthLevel dynamically based on yearsOfActivity
progressSchema.pre("save", function (next) {
  if (this.yearsOfActivity >= 5) {
    this.healthLevel = "Advanced Fitness Enthusiast";
  } else if (this.yearsOfActivity >= 2) {
    this.healthLevel = "Intermediate Fitness Enthusiast";
  } else {
    this.healthLevel = "Beginner Fitness Enthusiast";
  }
  next();
});

// Create and export the model
const Progress = mongoose.model("Progress", progressSchema);
module.exports = Progress;
