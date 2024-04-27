
const catchAsync = require("express-async-handler");
const tf = require("@tensorflow/tfjs");

const loadModel = catchAsync(async () => {
    try {
  
      const model = await tf.loadLayersModel(process.env.MODEL);
  
      return model;
    } catch (error) {
      console.error("Error loading model:", error);
    }
  });

module.exports = loadModel  