const Features = require("../models/featuresModel");
const catchAsync = require("express-async-handler");

exports.createFeatures = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  
  const feature = await Features.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      feature,
    },
  });
});


exports.getAllFeatures = catchAsync(async (req, res, next) => {

  let filter = {};
  
  // returning the features based on the user
  
  if (req.params.userId) filter = { user: req.params.userId };
  
  const features = await Features.find(filter);

  res.status(200).json({
    status: "success",
    results: features.length,
    data: {
      features,

    },
  });
});
