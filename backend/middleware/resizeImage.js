const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const resizeImage = (req, res, next) => {
  const filePath = req.file.path;
  const fileName = req.file.filename;
  const finalFilePath = path.join("images", `${fileName}`);

  console.log(fileName)
  console.log(filePath)
  console.log(finalFilePath)
  
  sharp(filePath)
    .resize({ width: 206, height: 260 })
    .toFile(finalFilePath)
    .then(() => {
      fs.unlink(filePath, () => {
        req.file.path = finalFilePath;
        next();
      });
    })
    .catch((err) => {
      console.log(err);
      return next();
    });
};

module.exports = resizeImage;
