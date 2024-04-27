const catchAsync = require("express-async-handler");
const tf = require("@tensorflow/tfjs");
const Features = require("../models/featuresModel");
const loadModel = require("../utils/loadingMode");
const AppError = require("../utils/appError");
const Datasets = require("../utils/timeSeriesData");

const prepareAndUseModelForPrediction = catchAsync(async (data) => {
  const sequenceLength = 360;
  const stride = 360;
  const model = await loadModel();

  if (!model) new AppError("Model could not be loaded", 404);

  const datasets = await Datasets(data, sequenceLength, stride);

  let allPredictions = [];
  for (const x of datasets) {
    const xTensor = tf.tensor3d(
      x.map((item) => item.map((subItem) => Array.from(subItem)))
    );
    const predictionData = model.predict(xTensor);

    const thresholdPredictions = Array.from(await predictionData.data()).map(
      (p) => (p > 0.5 ? 1 : 0)
    );
    allPredictions = allPredictions.concat(thresholdPredictions);

    xTensor.dispose();
  }

  return allPredictions;
});

exports.predict = catchAsync(async (req, res) => {
  const filter = { user: req.user._id };
  const data = await Features.find(filter);

  const pred = await prepareAndUseModelForPrediction(data);

  res.status(200).json({
    status: "success",
    results: pred.length,
    data: {
      pred,
    },
  });
});
