const { ApiErros } = require("../errors/customErrors");
const { MulterError } = require("multer");

const errorHandlerMiddlware = (err, req, res, next) => {
  // console.log(err);
  if (err instanceof ApiErros) {
    return res
      .status(err.statusCode)
      .json({ success: false, message: err.message });
  }
  if (err instanceof MulterError) {
    return res.status(400).json({ success: false, message: err.code });
  }
  return res
    .status(500)
    .json({ success: false, message: "Something went wrong..." });
};

module.exports = errorHandlerMiddlware;
