const cloudinary = require('../services/cloudinary');
const withAsyncCatcher = require('../helpers/withAsyncCatcher');

const uploadImage = withAsyncCatcher(async (req, res, next) => {
  if (!req.file) return next(new Error('Multer Upload Error'));
  const filename = `${req.file.fieldname}-${Math.round(
    Math.random() * 100000,
  )}-${Date.now()}-${req.file.originalname}`;
  const cloudFilepath = `images/${filename}`;
<<<<<<< HEAD
  cloudinary.uploader
    .upload_stream({ public_id: cloudFilepath }, (error, result) => {
      if (error) return next(error);
      req.body.image = result.secure_url;
      next();
    })
    .end(req.file.buffer);
=======
  const result = await uploadToCloudinary(cloudFilepath, req.file.buffer);
  req.imageResult = result;
  next();
>>>>>>> main
});

function uploadToCloudinary(public_id, buffer) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ public_id }, (error, result) => {
        if (error) return reject(error);

        resolve(result);
      })
      .end(buffer);
  });
}

module.exports = uploadImage;
