const express = require("express");
const featureController = require("../controllers/featuresController");

const authController = require("../controllers/authController");
const featuresValidator = require("../utils/validators/featuresVal");

const router = express.Router({ mergeParams: true });

// /user/features



router
  .route("/createfeature")
  .post(
    featuresValidator.createFeaturesValidator,
    authController.protects,
    featureController.createFeatures
  );


router.use("/:userId", featureController.getAllFeatures);

router.route("/").get(featureController.getAllFeatures);




module.exports = router;
