const express = require("express");

const onBoardingController = require("../controllers/OnBoardingController");

const router = express.Router();

router
  .route("/")
  .get(onBoardingController.getAllOnBoarding)
  .post(
    onBoardingController.uploadOnBoardingImage,
    onBoardingController.resizeImages,
    onBoardingController.createOnBoarding
  );

router
  .route("/:id")
  .patch(onBoardingController.updateOnBoarding)
  .delete(onBoardingController.deleteOnBoarding);

module.exports = router;
