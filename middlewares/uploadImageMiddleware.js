/* eslint-disable import/no-extraneous-dependencies */
const multer = require("multer");
const AppError = require("../utils/appError");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image"))
    return cb(
      new AppError("Not an image! Please upload only images.", 400),
      false
    );
  cb(null, true);
};

exports.uploadOneImage = (fieldName) => {
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
  return upload.single(fieldName);
};
// exports.uploadMixImage = (arrayOfFields) => {
//   const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
//   return upload.fields(arrayOfFields);
// };
