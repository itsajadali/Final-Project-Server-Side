const User = require("../models/userModel");
const catchAsync = require("express-async-handler");

const AppError = require("../utils/appError");

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.user.password || req.user.confirmPassword) {
    return next(
      new AppError(
        "this route is not for updating password, please user updateMyPassword",
        400
      )
    );
  }

  const { email, name } = req.body;
  const filtered = {
    name,
    email,
  };

  const updateUser = await User.findByIdAndUpdate(req.user.id, filtered, {
    new: true,
    runValidators: true,
  });

  res.status(400).json({
    status: "success",
    data: {
      user: updateUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    statu: "error",
    message: "This route is not created yet",
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    statu: "error",
    message: "This route is not created yet",
  });
};
exports.upDateUser = (req, res) => {
  res.status(500).json({
    statu: "error",
    message: "This route is not created yet",
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    statu: "error",
    message: "This route is not created yet",
  });
};
