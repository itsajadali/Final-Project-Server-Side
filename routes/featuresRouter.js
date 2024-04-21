const express = require("express");
const featureController = require("../controllers/featuresController");

const authController = require("../controllers/authController");
const featuresValidator = require("../utils/validators/featuresVal");

const router = express.Router({ mergeParams: true });

// /user/features

router.route("/").get(featureController.getAllFeatures);
router
  .route("/createfeature")
  .post(
    featuresValidator.createFeaturesValidator,
    authController.protects,
    featureController.createFeatures
  );

module.exports = router;
