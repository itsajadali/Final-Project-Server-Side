const mongoose = require("mongoose");

const onBoardingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const modifyingImag = (doc) => {
  if (!doc.image) return;

  doc.image = `${process.env.BASE_URL}/onBoarding/${doc.image}`;
  return doc;
};

// works on get request (it sends the document modifying the image)
onBoardingSchema.post("init", modifyingImag);

// works on create request (it sends the document modifying the image)
onBoardingSchema.post("save", modifyingImag);

const OnBoarding = mongoose.model("Boarding", onBoardingSchema);

module.exports = OnBoarding;
