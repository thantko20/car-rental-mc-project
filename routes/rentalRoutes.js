const router = require('express').Router();
const {
  getRentals,
  getRental,
  createRental,
  updateRental,
  deleteRental,
} = require('../controllers/rentalController');
const {
  validateRentalCreation,
} = require('../middlewares/validation/validateRentalCreation');
const validateRentalUpdate = require('../middlewares/validation/validateRentalUpdate');
const verifyToken = require('../middlewares/verifyToken');
const restrictRoles = require('../middlewares/restrictRoles');

router
  .route('/')
  .get(getRentals)
  .post(verifyToken, validateRentalCreation, createRental);
router
  .route('/:id')
  .get(verifyToken, getRental)
  .delete(restrictRoles(['ADMIN']), deleteRental)
  .patch(verifyToken, validateRentalUpdate, updateRental);

module.exports = router;
