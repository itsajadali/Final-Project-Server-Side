const catchAsync = require("express-async-handler");

const OnBoarding = require("../models/OnBoardingModel");
const { v4 } = require("uuid");
const sharp = require("sharp");

const uploadImages = require("../middlewares/uploadImageMiddleware");

exports.uploadOnBoardingImage = uploadImages.uploadOneImage("image");

exports.resizeImages = catchAsync(async (req, res, next) => {
  const filename = `Boarding-${v4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .toFormat("jpeg")
    .jpeg({ quality: 100 })
    .toFile(`images/onBoarding/${filename}`);

  req.body.image = filename;
  next();
});

exports.getAllOnBoarding = catchAsync(async (req, res) => {
  const onBoarding = await OnBoarding.find();
  res.status(200).json({
    status: "success",
    results: onBoarding.length,
    data: {
      onBoarding,
    },
  });
});

exports.createOnBoarding = catchAsync(async (req, res) => {
  const onBoarding = await OnBoarding.create(req.body);
  res.status(200).json({
    status: "success",
    data: {
      onBoarding,
    },
  });
});

exports.updateOnBoarding = catchAsync(async (req, res) => {
  const onBoarding = await OnBoarding.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      onBoarding,
    },
  });
});

exports.deleteOnBoarding = catchAsync(async (req, res) => {
  await OnBoarding.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});
