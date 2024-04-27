const express = require("express");
const controller = require("../controllers/usersController");
const authController = require("../controllers/authController");

const featuresRouter = require("./featuresRouter");

const router = express.Router();
const userValidator = require("../utils/validators/userVal");


router
  .route("/signup")
  .post(userValidator.signupValidator, authController.signup);
router.route("/login").post(userValidator.loginValidator, authController.login);

// router.route("/updateMe").patch(authController.protects, controller.updateMe);
// router.route("/deleteMe").delete(authController.protects, controller.deleteMe);

router
  .route("/updateMyPassword")
  .patch(
    userValidator.updatePasswordVal,
    authController.protects,
    authController.updatePassword
  );

router
  .route("/forgotPassword")
  .post(userValidator.forgotPasswordVal, authController.forgotPassword);

router
  .route("/verifyResetCode")
  .post(userValidator.verifyResetCodeVal, authController.verifyResetCode);

router
  .route("/resetPassword")
  .patch(userValidator.resetPasswordVal, authController.resetPassword);

router.route("/").get(controller.getAllUsers);
router
  .route("/:id")
  .get(controller.getUser)
  .patch(controller.upDateUser)
  .delete(controller.deleteUser);

module.exports = router;
