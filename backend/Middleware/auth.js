const jwt = require("jsonwebtoken");
const userSchema = require("../model/userModel");
const catchAsyncErrors = require("./catchAsyncErrors");
const ErrorHandler = require("../Utils/errorHandler.js");

const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const token = req.cookies.jwt;
  // console.log(req.cookies);
  // const {jwt} = req.cookies
  try {
    if (!token) {
      return res
        .status(401)
        .json({ message: " you are Unauthorized", authorized: false });
    }

    const decodedtoken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await userSchema.findById(decodedtoken.id);

    if (!user) {
      return next(
        new ErrorHandler("you are Unauthorized user does not exits", 401)
      );
    }

    const passwordChanged = await user.isPasswordChanged(decodedtoken.iat);

    if (passwordChanged) {
      return res
        .status(401)
        .json({ message: " password changed recently so please login again" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized, token is invalid" });
  }
});
const restrict = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "user do not permission this action forbidden" });
    }
    next();
  };
};

module.exports = { restrict, isAuthenticatedUser };
