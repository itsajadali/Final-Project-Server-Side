const { check, body } = require("express-validator");
const validationMiddleware = require("../../middlewares/validatorMiddleware");

exports.createFeaturesValidator = [
  check("enmo").isNumeric().withMessage("invalid enmo"),
  check("angles").isNumeric().withMessage("invalid angles"),
  validationMiddleware,
];
