const ApiError = require('../helpers/apiError');
const QueryHelper = require('../helpers/queryHelper');

module.exports = function makeUserService({ userModel }) {
  return {
    getUsers: async (query) => {
      const queryHelper = new QueryHelper(userModel.find(), query);
      queryHelper.filter().limitFields().sort().paginate();

      const users = await queryHelper.query;

      return users;
    },

    getUserById: async (id) => {
      const user = await userModel.findById(id);
      if (!user) {
        throw ApiError.badRequest('Invalid User ID');
      }

      return user;
    },

    updateUserById: async (id, data) => {
      const updatedUser = await userModel.findByIdAndUpdate(id, data, {
        new: true,
      });

      if (!updatedUser) {
        throw ApiError.badRequest('Invalid User ID');
      }

      return updatedUser;
    },

    deleteUserById: async (id) => {
      const user = await userModel.findByIdAndDelete(id);
      if (!user) {
        throw ApiError.badRequest('Invalid User ID');
      }
    },
  };
};
