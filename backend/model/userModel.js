const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
var validator = require("email-validator");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Optional for Google login
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: validator.validate,
      message: "Email address is not valid",
    },
  },
  password: {
    type: String,
    required: function () {
      return this.authMethod === "form"; // Password required only for form-based registration
    },
    minlength: 6,
  },
  confirmPassword: {
    type: String,
  },
  googleId: {
    type: String,
    required: function () {
      return this.authMethod === "google"; // Google ID required only for Google login
    },
  },
  authMethod: {
    type: String,
    enum: ["form", "google"], // 'form' or 'google' depending on the login method
    required: true,
  },
  profilePhoto: {
    type: String, // URL of the profile photo
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  selectedRoadmaps: [
    {
      roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: "Roadmap" },
      userSpecificRoadmap: {
        careerTitle: String,
        createdAt: { type: Date, default: Date.now },
        description: String,
        image: String,
        roadmapSteps: [
          {
            stepTitle: String,
            stepDescription: String,
            resources: [{ title: String, link: String, type: String }],
            completed: { type: Boolean, default: false },
          },
        ],
      },
    },
  ],
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpried: Date,
  refreshToken: {
    type: String,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  alarmTime: {
    type: String, // Store time in HH:MM format
    default: null,
  },
});

// Pre-save hook to update the updatedAt field
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    this.repassword = undefined;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.isPasswordChanged = async function (jwttime) {
  if (this.passwordChangedAt) {
    const passwordchangetime = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return jwttime < passwordchangetime;
  }
  return false;
};

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpried = Date.now() + 10 * 60 * 1000;
  return { passwordResetToken, resetToken };
};

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_LOGIN_EXPIRES,
  });
};

// Create and export the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
