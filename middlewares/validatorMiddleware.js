const { validationResult } = require("express-validator");
const AppError = require("../utils/appError");

const validationMiddleware = (req, res, next) => {
  const err = validationResult(req);

  if (!err.isEmpty()) {
    return next(new AppError(err.array()[0].msg, 400));
  }
  next();
};

module.exports = validationMiddleware;
