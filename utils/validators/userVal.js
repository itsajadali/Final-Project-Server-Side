const { check, body } = require("express-validator");
const validationMiddleware = require("../../middlewares/validatorMiddleware");

const User = require("../../models/userModel");

exports.idValidator = [
  check("id").isMongoId().withMessage("invalid id"),
  validationMiddleware,
];

exports.signupValidator = [
  check("name").notEmpty().withMessage("name is required"),
  check("email")
    .isEmail()
    .withMessage("invalid email")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (!user) return true;

      throw new Error("email already exists");
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be above 6 char"),
  check("passwordConfirm")
    .notEmpty()
    .withMessage("password confirm required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("password don't match");
      }
      return true;
    }),
  validationMiddleware,
];

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email"),
  check("password").notEmpty().withMessage("password required"),
  validationMiddleware,
];

exports.updatePasswordVal = [
  check("currentPassword").notEmpty().withMessage("password required"),
  check("newPassword").notEmpty().withMessage("new Password required"),
  check("confirmNewPassword")
    .notEmpty()
    .withMessage("confirm Password required")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("password don't match");
      }
      return true;
    }),
  validationMiddleware,
];

exports.forgotPasswordVal = [
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email"),
  validationMiddleware,
];

exports.verifyResetCodeVal = [
  check("resetCode").notEmpty().withMessage("reset code required"),
  validationMiddleware,
];

exports.resetPasswordVal = [
  check("email")
    .notEmpty()
    .withMessage("email required")
    .isEmail()
    .withMessage("invalid email"),
  check("password").notEmpty().withMessage("password required"),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirm password required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("password don't match");
      }
      return true;
    }),
  validationMiddleware,
];
