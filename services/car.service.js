const QueryHelper = require('../helpers/queryHelper');

module.exports = function makeCarService({ carModel }) {
  return {
    getCars: async (query) => {
      const queryHelper = new QueryHelper(carModel.find(), query);
      queryHelper.filter().limitFields().sort().paginate();

      const cars = await queryHelper.query;
      return cars;
    },

    getCarById: async (id) => {
      const car = await carModel.findById(id);
      return car;
    },

    createCar: async (data) => {
      const car = await carModel.create(data);
      return car;
    },

    updateCarById: async (id, data) => {
      const car = await carModel.findByIdAndUpdate(id, data, { new: true });

      return car;
    },

    deleteCarById: async (id) => {
      const car = await carModel.findByIdAndDelete(id);
      return car;
    },
  };
};
