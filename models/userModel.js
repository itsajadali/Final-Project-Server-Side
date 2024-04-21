const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "please enter you name"],
  },
  email: {
    type: String,
    required: [true, "please Enter your email"],
    unique: true,
    lowerCase: true,
    validate: [validator.isEmail, "provide vialed email"],
  },
  photo: String,
  password: {
    type: String,
    required: true,
    minLength: 8,

    select: false,
  },
  changedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  passwordResetVerified: Boolean,

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
});

userSchema.pre("save", function (next) {
  // is new to check if the document is new
  if (!this.isModified("password") || this.isNew) return next();

  // * saving to DB is slower then issued token
  this.passwordChangedAt = Date.now() - 100;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: true });
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordRestToken = function () {
  const restToken = crypto.randomBytes(4).toString("hex"); // generating random string

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(restToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
  this.passwordResetVerified = false;
  return restToken; // we gonna sent it via email
};

// user is a document
const User = mongoose.model("User", userSchema);
module.exports = User;
