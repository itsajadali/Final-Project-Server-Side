const express = require("express");

const router = express.Router();
const modelController = require("../controllers/modelController");

router.route("/").get(modelController.predict);

module.exports = router;
