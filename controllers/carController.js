const CarModel = require('../models/carModel');
const withAsyncCatcher = require('../helpers/withAsyncCatcher');
const ApiError = require('../helpers/apiError');
const QueryHelper = require('../helpers/queryHelper');
const destroyImage = require('../middlewares/destroyImage');

exports.getCars = withAsyncCatcher(async (req, res, next) => {
  const queryHelper = new QueryHelper(CarModel.find(), req.query);

  queryHelper.filter().limitFields().sort().paginate();

  const cars = await queryHelper.query;

  res.json({
    status: 'success',
    data: {
      cars,
    },
  });
});

exports.getACar = withAsyncCatcher(async (req, res, next) => {
  const car = await CarModel.findById(req.params.id);
  if (!car) {
    return next(ApiError.badRequest('Invalid Car ID'));
  }

  res.json({
    status: 'success',
    data: {
      car,
    },
  });
});

exports.createACar = withAsyncCatcher(async (req, res, next) => {
  const imageResult = req.imageResult;
  try {
    const car = await CarModel.create({
      ...req.body,
      image: imageResult.secure_url,
    });
    res.json({
      status: 'success',
      data: {
        car,
      },
    });
  } catch (error) {
    await destroyImage(imageResult.public_id);
    next(error);
  }
});

exports.updateCar = withAsyncCatcher(async (req, res, next) => {
  const car = await CarModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!car) {
    return next(ApiError.badRequest('Invalid Car ID'));
  }

  res.status(201).json({
    status: 'success',
    data: {
      car,
    },
  });
});

exports.deleteCar = withAsyncCatcher(async (req, res, next) => {
  const car = await CarModel.findByIdAndDelete(req.params.id);
  if (!car) {
    return next(ApiError.badRequest('Invalid Car ID.'));
  }

  res.json({
    status: 'success',
    data: {
      car: null,
    },
  });
});
