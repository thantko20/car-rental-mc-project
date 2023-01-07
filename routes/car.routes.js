const {
  validateCarCreation,
} = require('../middlewares/validation/validateCarCreation');
const validateCarUpdate = require('../middlewares/validation/validateCarUpdate');
const restrictRoles = require('../middlewares/restrictRoles');
const multerUpload = require('../helpers/multerUpload');
const { createController } = require('awilix-express');
const carController = require('../controllers/car.controller');

module.exports = createController(carController)
  .prefix('/cars')
  .get('', 'getCars')
  .post('', 'createCar', {
    before: [
      restrictRoles(['ADMIN']),
      multerUpload.single('car_image'),
      validateCarCreation,
    ],
  })
  .get('/:id', 'getCar')
  .patch('/:id', 'updateCar', {
    before: [
      restrictRoles(['ADMIN']),
      multerUpload.single('car_image'),
      validateCarUpdate,
    ],
  })
  .delete('/:id', 'deleteCar', { before: [restrictRoles(['ADMIN'])] });
