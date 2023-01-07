const withAsyncCatcher = require('../helpers/withAsyncCatcher');
const ApiError = require('../helpers/apiError');
const createRandomFilename = require('../helpers/createRandomFilename');

module.exports = ({ carService, cloudinaryService }) => {
  return {
    getCars: withAsyncCatcher(async (req, res, next) => {
      const cars = await carService.getCars(req.query);
      res.json({
        status: 'success',
        data: {
          cars,
        },
      });
    }),

    getCar: withAsyncCatcher(async (req, res, next) => {
      const car = await carService.getCarById(req.params.id);
      if (!car) {
        return next(ApiError.badRequest('Invalid Car ID'));
      }

      res.json({
        status: 'success',
        data: {
          car,
        },
      });
    }),

    createCar: withAsyncCatcher(async (req, res, next) => {
      if (!req.file) {
        return next(Error('No image attached.'));
      }

      const file = req.file;
      const cloudFilepath = createRandomFilename(file);
      const imageResult = await cloudinaryService.uploadImageStream(
        cloudFilepath,
        file.buffer,
      );

      try {
        const car = await carService.createCar({
          ...req.body,
          image: imageResult.secure_url,
        });
        if (!car) {
          return next(ApiError.badRequest('Invalid Car ID'));
        }
        res.json({
          status: 'success',
          data: {
            car,
          },
        });
      } catch (error) {
        await cloudinaryService.deleteImage(imageResult.public_id);
        next(error);
      }
    }),

    updateCar: withAsyncCatcher(async (req, res, next) => {
      let imageResult;
      if (req.file) {
        const cloudFilepath = createRandomFilename(req.file);
        imageResult = await cloudinaryService.uploadImageStream(
          cloudFilepath,
          req.file.buffer,
        );
      }
      const data = imageResult
        ? { ...req.body, image: imageResult.secure_url }
        : req.body;

      try {
        const car = await carService.updateCar(req.params.id, data);
        if (!car) {
          return next(ApiError.badRequest('Invalid Car ID'));
        }
        res.json({
          status: 'success',
          data: {
            car,
          },
        });
      } catch (error) {
        if (imageResult) {
          await cloudinaryService.deleteImage(imageResult.public_id);
        }
        next(error);
      }
    }),

    deleteCar: withAsyncCatcher(async (req, res, next) => {
      const car = await carService.findByIdAndDelete(req.params.id);
      if (!car) {
        return next(ApiError.badRequest('Invalid Car ID'));
      }
    }),
  };
};
