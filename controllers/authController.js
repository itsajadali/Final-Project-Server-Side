const jwt = require("jsonwebtoken");

// make a function return a promise.
const crypto = require("crypto");

const catchAsync = require("express-async-handler");

const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");

const signToken = (id) =>
  // creating the token.
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

// authentication:
exports.signup = catchAsync(async (req, res, next) => {
  // 1) getting the user info
  const { name, email, password } = req.body;

  // 2) saving user to DB
  const newUser = await User.create({
    name,
    email,
    password,
  });

  // 3) creating token to user based on JWT algorithm

  createSendToken(newUser, 201, res);
});

// ! logging in user
exports.login = catchAsync(async (req, res, next) => {
  // 1) getting the email and password
  const { email, password } = req.body;

  // 3) finding the user by email and make the password visible
  const user = await User.findOne({ email }).select("+password"); // + to set select to true (showing up password)

  // 4) comparing the encrypted password with the one entered
  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  createSendToken(user, 200, res);
});

exports.protects = catchAsync(async (req, res, next) => {
  // 1) getting a token and check if it's exists
  let token;

  // getting it from the header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; // splitting it to get the token
  }

  // chekiang if it's exists
  if (!token) {
    return next(new AppError("Please login to access this resource", 401));
  }

  // 2) verification token

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) check if the token is valid
  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError("User is no longer exists", 401));
  }

  // 4) check if user has change  password after the token was issued

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }
  req.user = currentUser;
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new AppError("user not found", 404));

  const resetToken = user.createPasswordRestToken();
  await user.save({ validateBeforeSave: false });

  const message = `
  
  Dear ${user.name} 

  We received a request to reset your password for your account at sleep tracker. If you did not make this request, please ignore this email.
  
  To reset your password, please paste the following code into your browser 
  
  ${resetToken} If you did not make this request, please ignore this email.

  This code will expire in 10 minutes for security purposes.

  If you encounter any issues or did not request a password reset, please contact our support team at ${process.env.SUPPORT_EMAIL}.

  Thank you for using our app.

  Best regards,
  Customer Support

  `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset Request",
      message,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("there was an error sending the email", 500));
  }

  res.status(200).json({
    status: "success",
    message: "email sent",
  });
});

exports.verifyResetCode = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  verifyResetCode;

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("token is invalid or expired", 400));

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = true;

  await user.save();

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) return next(new AppError("user not found", 404));

  if (!user.passwordResetVerified)
    return next(new AppError("password reset not verified", 400));

  user.password = req.body.password;
  user.passwordResetVerified = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) get user from collection
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.comparePassword(req.body.currentPassword, user.password)))
    return next(new AppError("your current password is wrong", 401));

  user.password = req.body.newPassword;

  await user.save();

  createSendToken(user, 200, res);
});
