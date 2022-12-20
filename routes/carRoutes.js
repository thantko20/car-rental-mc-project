const router = require('express').Router();
const {
  getCars,
  createACar,
  getACar,
  updateCar,
  deleteCar,
} = require('../controllers/carController');
const validateCarCreation = require('../middlewares/validation/validateCarCreation');
const validateCarUpdate = require('../middlewares/validation/validateCarUpdate');
const uploadImage = require('../middlewares/uploadImage');
const verifyAdmin = require('../middlewares/verifyAdmin');
const multerUpload = require('../helpers/multerUpload');

router
  .route('/')
  .get(getCars)
  .post(
    verifyAdmin,
    multerUpload.single('car_image'),
    uploadImage,
    validateCarCreation,
    createACar,
  );

router
  .route('/:id')
  .get(getACar)
  .patch(
    verifyAdmin,
    multerUpload.single('car_image'),
    uploadImage,
    validateCarUpdate,
    updateCar,
  )
  .delete(verifyAdmin, deleteCar);

module.exports = router;
