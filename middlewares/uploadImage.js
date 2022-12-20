const cloudinary = require('../services/cloudinary');
const withAsyncCatcher = require('../helpers/withAsyncCatcher');

const uploadImage = withAsyncCatcher(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `${req.file.fieldname}-${Math.round(
    Math.random() * 100000,
  )}-${Date.now()}-${req.file.originalname}`;
  const cloudFilepath = `images/${filename}`;
  cloudinary.uploader
    .upload_stream({ public_id: cloudFilepath }, (error, result) => {
      if (error) return next(error);

      req.body.image = result.secure_url;
      next();
    })
    .end(req.file.buffer);
});

module.exports = uploadImage;
