const path = require("path");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");
const hpp = require("hpp");

const usersRouter = require("./routes/usersRouts");
const featuresRouter = require("./routes/featuresRouter");
const modelRouter = require("./routes/modelRouter");
const onBoardingRouter = require("./routes/onBoardingRouter");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(cors({ origin: "*" }));

app.use(helmet());

// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 100,
//   message: "Too many requests",
// });

// app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "images")));

app.use(mongoSanitize());
app.use(xss());

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/features", featuresRouter);
app.use("/api/v1/predict", modelRouter);
app.use("/api/v1/onboarding", onBoardingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`${req.originalUrl} Not Found`, 404)); //m will send the entire class.
  //
});

app.use(globalErrorHandler);

module.exports = app;
