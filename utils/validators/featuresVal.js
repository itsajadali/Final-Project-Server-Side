const { check, body } = require("express-validator");
const validationMiddleware = require("../../middlewares/validatorMiddleware");

exports.createFeaturesValidator = [
  check("enmo").notEmpty().withMessage("enmo is required").isNumeric().withMessage("invalid enmo"),
  check("angles").notEmpty().withMessage("angles is required").isNumeric().withMessage("invalid angles"),
  validationMiddleware,
];
