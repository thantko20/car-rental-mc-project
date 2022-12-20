const multer = require('multer');
const FILE_SIZE_IN_BYTES = 1000000;
const multerStorage = multer.memoryStorage();

const multerUpload = multer({
  storage: multerStorage,
  limits: {
    fileSize: FILE_SIZE_IN_BYTES,
  },
});

module.exports = multerUpload;
