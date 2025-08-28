const userSchema = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../Utils/email");
const crypto = require("crypto");
const ErrorHandler = require("../Utils/errorHandler");
const catchAsyncErrors = require("../Middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");

const login = catchAsyncErrors(async (req, res, next) => {
  // const { UsernameOrEmail, password, role } = req.body;
  const { UsernameOrEmail, password, role } = req.body;
  console.log(req.body);
  // console.log(req.body);

  if (!UsernameOrEmail || !password) {
    return next(
      new ErrorHandler("please enter email or username and password", 400)
    );
  }

  const isEmail = UsernameOrEmail.includes("@");

  let user;
  // console.log(user);

  if (isEmail) {
    user = await userSchema.findOne({ email: UsernameOrEmail });
  } else {
    user = await userSchema.findOne({ username: UsernameOrEmail });
  }
  // console.log(user);
  // console.log(user);
  if (!user) {
    return next(new ErrorHandler("invalid credentials", 401));
  }

  // const passwordMatch = await bcrypt.compare(password, user.password);
  // if (!passwordMatch) {
  //   return next(new ErrorHandler("invalid credentials", 401));
  // }

  sendToken(user, 200, res);
});

const userInsert = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    // Log the request body to ensure all fields are coming through
    // console.log("Request Body:", req.body);

    // Check if passwords match
    if (password !== confirmPassword) {
      return next(new ErrorHandler("Passwords do not match", 400));
    }

    // Check for existing user with same email or username
    const existingUser = await userSchema.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return next(new ErrorHandler("Email or Username already exists", 409));
    }

    // Create new user instance without phoneNumber
    const userData = new userSchema({
      username,
      email,
      password, // You should hash the password before saving
      authMethod: "form", // Set the authMethod to "form" for form-based login
    });

    // console.log("User Data Created:", userData);

    // Save user to database
    const storeUser = await userData.save();
    storeUser.password = undefined; // Don't send the password back in the response

    res.status(201).json({ success: true, storeUser });
  } catch (err) {
    console.error("Error occurred:", err); // Log detailed error for debugging
    return next(new ErrorHandler("Internal Server Error", 500));
  }
};

const forgetPassword = async (req, res, next) => {
  try {
    const foundUser = await userSchema.findOne({ email: req.body.email });

    if (!foundUser) {
      return next(new ErrorHandler("User not found with the given Email", 404));
    }

    const token = foundUser.createResetPasswordToken();
    foundUser.passwordResetTokenExpried = Date.now() + 10 * 60 * 1000;
    foundUser.passwordResetToken = token.passwordResetToken;
    await foundUser.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.hostname}:5173/resetPassword/${token.resetToken}`;

    const message = `Please reset your password using the link below:\n${resetUrl}\nThis reset link is valid for 10 minutes.`;

    try {
      await sendEmail({
        to: foundUser.email,
        subject: "Password Change Request Received from Pathfinder AI",
        text: message,
      });

      return res
        .status(200)
        .json({ status: "success", message: "Email sent successfully", token });
    } catch (error) {
      foundUser.passwordResetToken = undefined;
      foundUser.passwordResetTokenExpried = undefined;
      await foundUser.save({ validateBeforeSave: false });
      return next(new ErrorHandler("Error while sending Email", 500));
    }
  } catch (err) {
    return next(new ErrorHandler("Error while sending Email", 500));
  }
};

const Logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("jwt", "", {
    expires: new Date(0),
    httpOnly: true,
  });
  res.status(200).json({ success: true, message: "Logged Out" });
});

const passwordReset = catchAsyncErrors(async (req, res, next) => {
  try {
    const token = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await userSchema.findOne({
      passwordResetToken: token,
      passwordResetTokenExpried: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new ErrorHandler("Reset Password Token is invalid or expired", 400)
      );
    }

    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("password does not password", 400));
    }

    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpried = undefined;
    user.passwordChangedAt = Date.now();
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return next(new ErrorHandler("Error occurred while sending Email", 500));
  }
});

const updateUserPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await userSchema.findById(req.user._id);
  // console.log(req.body);

  const isPasswordMatched = await bcrypt.compare(
    req.body.oldPassword,
    user.password
  );

  if (!isPasswordMatched) {
    return next(new ErrorHandler("old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

const updateProfile = catchAsyncErrors(async (req, res, next) => {
  try {
    const { username, email } = req.body;
    // console.log(req.file);
    const profilePhoto = req.file ? req.file.filename : null;

    const updatedUser = await userSchema.findByIdAndUpdate(
      req.user.id,
      { username, email, profilePhoto },
      { new: true }
    );

    res.status(200).json({
      username: updatedUser.username,
      email: updatedUser.email,
      profilePhoto: updatedUser.profilePhoto,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the profile." });
  }
});

const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await userSchema.findById(req.user._id);

  res.status(200).json({ success: true, user });
});

const roadmapSchema = require("../model/roadmapSchema");

const postUserDashboard = async (req, res) => {
  const { roadmapId } = req.body;
  const userId = req.user.id; // Authenticated user ID]clg

  try {
    // Fetch roadmap
    const roadmap = await roadmapSchema.findById(roadmapId);
    if (!roadmap) {
      return res.status(404).json({ message: "Roadmap not found" });
    }

    // Find user
    const user = await userSchema.findById(userId);

    // Check if roadmap already exists in selectedRoadmaps
    const alreadySelected = user.selectedRoadmaps.some(
      (item) => item.roadmapId.toString() === roadmapId
    );

    if (alreadySelected) {
      return res.status(400).json({ message: "Roadmap already selected" });
    }

    console.log(roadmap.careerTitle, "hui");
    console.log(roadmap.description, "hui");

    // Push new roadmap
    user.selectedRoadmaps.push({
      roadmapId,
      // careerTitle: roadmap.careerTitle,

      userSpecificRoadmap: {
        careerTitle: roadmap.careerTitle,
        description: roadmap.description,
        image: roadmap.image,
        roadmapSteps: roadmap.roadmapSteps,
        createdAt: new Date(),
      },
    });

    // console.log("user", user);

    // Save the user document
    await user.save();

    res.status(200).json({ message: "Roadmap selected successfully" });
  } catch (error) {
    console.error("Error selecting roadmap:", error);
    res.status(500).json({ message: "Error selecting roadmap" });
  }
};

// PUT /update-progress
const UpdateProgress = async (req, res) => {
  const userId = req.user.id; // userId from the token
  const { roadmapId, completedSteps } = req.body; // Array of step IDs that are completed

  try {
    // Fetch the user and populate the selectedRoadmaps
    const user = await userSchema.findById(userId).populate("selectedRoadmaps");

    const selectedRoadmap = user.selectedRoadmaps.find(
      (roadmap) => roadmap.roadmapId.toString() === roadmapId
    );

    if (selectedRoadmap) {
      // Iterate over roadmapSteps and update `completed` status
      const roadmapSteps = selectedRoadmap.userSpecificRoadmap.roadmapSteps;

      const completedStepIds = completedSteps.map((item) => item.stepId);

      // Calculate the number of completed steps
      const completedCount = roadmapSteps.filter((step) =>
        completedStepIds.includes(step._id.toString())
      ).length;

      // Calculate progress as a percentage
      const totalSteps = roadmapSteps.length;
      const progress = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

      // Update the steps' completion status
      roadmapSteps.forEach((step) => {
        step.completed = completedStepIds.includes(step._id.toString());
      });

      // Mark the nested field as modified for Mongoose to detect changes
      selectedRoadmap.userSpecificRoadmap.markModified("roadmapSteps");

      // Save the parent user document
      await user.save();

      return res.status(200).json({
        message: "Progress updated successfully!",
        progress: Math.round(progress), // Send back progress in the response
      });
    } else {
      return res.status(404).json({ message: "Roadmap not found" });
    }
  } catch (error) {
    console.error("Error updating progress:", error);
    return res.status(500).json({ message: "Error updating progress", error });
  }
};

const getUserDashboard = async (req, res) => {
  const userId = req.user.id; // Assuming the user is authenticated

  try {
    const user = await userSchema.findById(userId);

    // console.log(user.selectedRoadmaps.length, "huui");
    // console.log(user);

    if (!user || user.selectedRoadmaps.length === 0) {
      return res.json({ message: "No selected roadmap found" });
    }
    // console.log(user.selectedRoadmaps);

    res.status(200).json({ selectedRoadmaps: user.selectedRoadmaps });
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};

// Function to get a single user's dashboard data
const getSingleUserDashboard = async (req, res) => {
  const roadmapId = req.params.id; // Roadmap ID to find
  const userId = req.user.id; // Authenticated user's ID

  try {
    // Fetch user by ID and populate their selectedRoadmaps
    const user = await userSchema.findById(userId).populate("selectedRoadmaps");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the specific roadmap in the selectedRoadmaps array
    const selectedRoadmap = user.selectedRoadmaps.find(
      (roadmap) => roadmap.roadmapId.toString() === roadmapId
    );

    if (!selectedRoadmap) {
      return res
        .status(404)
        .json({ message: "Roadmap not found in user's selections" });
    }

    // Respond with the specific roadmap data
    res.status(200).json(selectedRoadmap);
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching user dashboard data" });
  }
};

const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const result = await userSchema.deleteOne({ _id: req.params.id });

  if (result.deletedCount === 0) {
    return next(
      new ErrorHandler("User does not exist with ID: ", req.params.id)
    );
  }

  res.status(200).json({ success: true });
});

const getUsers = catchAsyncErrors(async (req, res, next) => {
  const user = await userSchema.find(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler("User does not exit with Id: ", req.params.id)
    );
  }

  res.status(200).json({
    success: true,
    user,
    message: "User deleted successfully",
  });
});

const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const user = await userSchema.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler("User does not exist with ID: ", req.params.id)
    );
  }

  user.role = req.body.role;

  await user.save();

  res.status(200).json({ success: true });
});

const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await userSchema.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// controllers/alarmContr
const cron = require("node-cron");
const setAlarm = async (req, res, next) => {
  const { time } = req.body;

  // Check if time is provided
  if (!time) {
    return res.status(400).json({ message: "Please provide a time." });
  }

  try {
    // Find the user from the request object (JWT token)
    const user = await userSchema.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Store the alarm time in the user's profile
    user.alarmTime = time; // Store alarm time in your user schema

    await user.save();

    // Construct the email message
    const message = `Hello ${user.username},\nThis is your daily alarm reminder at ${time} from Pathfinder AI.\n“Success is the sum of all efforts, repeated day-in & day out.”`;
    console.log(
      `Cron job scheduled to run at ${time.split(":")[0]}:${time.split(":")[1]}`
    );

    // Schedule the email to be sent daily at the specified time
    cron.schedule(
      `0 ${time.split(":")[1]} ${time.split(":")[0]} * * *`,
      async () => {
        try {
          // Send the alarm email
          await sendEmail({
            to: user.email, // Use the email from the user document
            subject: "Your Daily Alarm Reminder",
            text: message,
            html: `<h1>Hello ${user.username}</h1><p>This is your daily alarm reminder at ${time}.\n“Success is the sum of all efforts, repeated day-in & day out.”</p>`,
          });
          console.log(`Daily alarm email sent to ${user.email} at ${time}`);
        } catch (error) {
          console.error("Error sending daily alarm email:", error);
        }
      }
    );

    return res.status(200).json({
      message: "Alarm set successfully, and it will send a daily reminder.",
    });
  } catch (error) {
    console.error("Error setting alarm:", error);
    return next(new ErrorHandler("Error occurred while setting alarm.", 500));
  }
};

module.exports = {
  userInsert,
  login,
  Logout,
  forgetPassword,
  passwordReset,
  updateUserPassword,
  updateProfile,
  getUserDetails,
  postUserDashboard,
  UpdateProgress,
  getUserDashboard,
  getSingleUserDashboard,
  deleteUser,
  getUsers,
  updateUserRole,
  getAllUsers,
  setAlarm,
};
