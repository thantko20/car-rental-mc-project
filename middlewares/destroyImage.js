const cloudinary = require('../lib/cloudinary');

module.exports = (public_id) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (error) return reject(error);

      resolve(result);
    });
  });
};
