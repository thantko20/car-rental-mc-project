const cloudinary = require('../lib/cloudinary');

module.exports = function makeCloudinaryService() {
  return {
    uploadImageStream: (path, buffer) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ public_id: path }, (error, result) => {
            if (error) return reject(error);

            resolve(result);
          })
          .end(buffer);
      });
    },

    deleteImage: async (public_id) => {
      await cloudinary.uploader.destroy(public_id);
    },
  };
};
