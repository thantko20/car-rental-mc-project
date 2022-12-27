const router = require('express').Router();
const {
  getCars,
  createACar,
  getACar,
  updateCar,
  deleteCar,
} = require('../controllers/carController');
const {
  validateCarCreation,
} = require('../middlewares/validation/validateCarCreation');
const validateCarUpdate = require('../middlewares/validation/validateCarUpdate');
const uploadImage = require('../middlewares/uploadImage');
const restrictRoles = require('../middlewares/restrictRoles');
const multerUpload = require('../helpers/multerUpload');

router
  .route('/')
  .get(getCars)
  .post(
    restrictRoles(['ADMIN']),
    multerUpload.single('car_image'),
    validateCarCreation,
    uploadImage,
    createACar,
  );

router
  .route('/:id')
  .get(getACar)
  .patch(
    restrictRoles(['ADMIN']),
    multerUpload.single('car_image'),
    validateCarUpdate,
    uploadImage,
    updateCar,
  )
  .delete(restrictRoles(['ADMIN']), deleteCar);

module.exports = router;
