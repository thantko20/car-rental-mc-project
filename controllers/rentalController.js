const ApiError = require('../helpers/apiError');
const QueryHelper = require('../helpers/queryHelper');
const withAsyncCatcher = require('../helpers/withAsyncCatcher');
const RentalModel = require('../models/rentalModel');
const CarModel = require('../models/carModel');

exports.getRentals = withAsyncCatcher(async (req, res, next) => {
  const queryHelper = new QueryHelper(RentalModel.find(), req.query);
  queryHelper.filter().limitFields().sort().paginate();
  const rentals = await queryHelper.query;

  res.json({
    status: 'success',
    data: {
      rentals,
    },
  });
});

exports.getRental = withAsyncCatcher(async (req, res, next) => {
  const rental = await RentalModel.findById(req.params.id);

  if (!rental) {
    return next(ApiError.badRequest('Invalid Rental ID'));
  }

  res.json({
    status: 'success',
    data: {
      rental,
    },
  });
});

exports.createRental = withAsyncCatcher(async (req, res, next) => {
  const car = await CarModel.findOneAndUpdate(
    { _id: req.body.car, status: 'available' },
    { status: 'busy' },
  );
  if (!car) {
    return next(ApiError.badRequest('Car does not exist.'));
  }
  const rental = await RentalModel.create({
    ...req.body,
    lessee: req.user._id,
  });
  res.json({
    status: 'success',
    data: {
      rental,
    },
  });
});

exports.updateRental = withAsyncCatcher(async (req, res, next) => {
  const rental = await RentalModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!rental) {
    return next(ApiError.badRequest('Invalid Rental ID'));
  }
  res.json({
    status: 'success',
    data: {
      rental,
    },
  });
});

exports.deleteRental = withAsyncCatcher(async (req, res, next) => {
  const rental = await RentalModel.findByIdAndDelete(req.params.id);
  if (!rental) {
    return next(ApiError.badRequest('Invalid Rental ID'));
  }
  res.json({
    status: 'success',
    data: {
      rental: null,
    },
  });
});
