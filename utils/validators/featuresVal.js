const { check, body } = require("express-validator");
const validationMiddleware = require("../../middlewares/validatorMiddleware");

exports.createFeaturesValidator = [
  check("features").notEmpty().withMessage("features is required"),
  validationMiddleware,
];
