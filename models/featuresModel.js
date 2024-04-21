const mongoose = require("mongoose");

const featuresSchema = {
  enmo: Number,
  angles: Number,

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  createAt: {
    type: Date,
    default: Date.now,
    select: true,
  },
};

const Features = mongoose.model("Features", featuresSchema);

module.exports = Features;
