const tf = require("@tensorflow/tfjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const StandardScaler = require("../utils/standerScaler");

const featuresSchema = new Schema({
  features: [[{ type: Schema.Types.Mixed }]], // Define a 3D array
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: true,
  },
});



featuresSchema.pre("save", async function (next) {

  // scaling the data
  const scaler = new StandardScaler();
  const scaledData = await scaler.scale(this.features);

  this.features = scaledData;

  console.log("Data has been scaled");
  next();
})


/// ! ##################### 
function printArrayShape(arr) {
  if (!Array.isArray(arr)) {
      console.error("Input is not an array.");
      return;
  }

  function getShape(array, shape) {
      if (Array.isArray(array)) {
          shape.push(array.length);
          if (Array.isArray(array[0])) {
              getShape(array[0], shape);
          }
      }
  }

  const shape = [];
  getShape(arr, shape);
  console.log("Shape:", shape);
}

featuresSchema.pre("save", async function (next) {
  printArrayShape(this.features);
  next();
})


const Features = mongoose.model("Features", featuresSchema);

module.exports = Features;
