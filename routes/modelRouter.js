const express = require("express");

const router = express.Router();
const modelController = require("../controllers/modelController");
const authController = require("../controllers/authController");

router.route("/").get(authController.protects, modelController.predict);

module.exports = router;
