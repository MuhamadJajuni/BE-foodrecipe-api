const cloudinary = require("cloudinary").v2;

const removeFile = async (file) => {
  if (file) {
    try {
      await cloudinary.uploader.destroy(file);
    } catch (err) {
      console.log(err);
    }
  }
};

module.exports = removeFile;
