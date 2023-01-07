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
const authenticate = require('../middlewares/authenticate');
const restrictRoles = require('../middlewares/restrictRoles');
const attachUser = require('../middlewares/attachUser');

router
  .route('/')
  .get(getRentals)
  .post(authenticate, attachUser, validateRentalCreation, createRental);
router
  .route('/:id')
  .get(authenticate, attachUser, getRental)
  .delete(restrictRoles(['ADMIN']), deleteRental)
  .patch(authenticate, attachUser, validateRentalUpdate, updateRental);

module.exports = router;
