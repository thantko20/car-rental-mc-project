const QueryHelper = require('../helpers/queryHelper');

module.exports = function makeRentalService({ rentalModel }) {
  return {
    getRentals: async (query) => {
      const queryHelper = new QueryHelper(rentalModel.find(), query);
      queryHelper.filter().limitFields().sort().paginate();

      const rentals = await queryHelper.query;

      return rentals;
    },

    getRentalById: async (id) => {
      const rental = await rentalModel.findById(id);
      return rental;
    },

    // createRental: async (data) => {
    //   const rental = await rentalModel
    // }
  };
};
