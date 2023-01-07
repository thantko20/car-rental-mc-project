const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const ApiError = require('../helpers/apiError');
const { JWT_EXPIRES, JWT_SECRET } = require('../constants');
const excludeFields = require('../helpers/excludeFields');

module.exports = function makeAuthService({ userModel }) {
  const comparePasswords = async (plainText, hash) => {
    return await bcrypt.compare(plainText, hash);
  };

  const createJWTToken = (payload) =>
    new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES },
        (error, token) => {
          if (error) return reject(error);

          resolve(token);
        },
      );
    });

  const createPasswordToken = () => {
    const randomHexString = crypto.randomBytes(32).toString('hex');
    const resetToken = crypto
      .createHash('sha256')
      .update(randomHexString)
      .digest('hex');
    const resetMaxAge = Date.now() + 1000 * 60 * 30;

    return {
      token: randomHexString,
      encryptedToken: resetToken,
      expires: resetMaxAge,
    };
  };

  return {
    register: async (data) => {
      const user = await userModel.create(data);
      return user;
    },

    login: async ({ email, password }) => {
      const user = await userModel
        .findOne({
          email,
        })
        .select('+password');

      const isValidPassword = comparePasswords(password, user.password);
      if (!user || !(await isValidPassword)) {
        throw ApiError.notAuthenticated('Invalid Credentials.');
      }

      const token = await createJWTToken({ userId: user.id });

      return { user: excludeFields(user), token };
    },

    forgotPassword: async ({ email, req }) => {
      const { token, encryptedToken, expires } = createPasswordToken();
      const user = await userModel.findOneAndUpdate(
        { email },
        { passwordResetToken: encryptedToken, passwordResetExpires: expires },
      );
      if (!user) {
        throw ApiError.badRequest('Invalid email.');
      }

      const resetUrl = `${req.protocol}://${req.get(
        'host',
      )}/api/v1/reset-password/${token}`;

      const message = `Please visit the link below to reset your passowrd. ${resetUrl}.\nIf you didn't forget your password, just ignore this mail.`;

      return { message, user };

      // try {
      //   await sendEmail({
      //     email: user.email,
      //     subject: 'Password Reset for Car Rental Account.',
      //     message,
      //   });
      // } catch (error) {
      //   await userModel.updateOne(
      //     { id: user.id },
      //     { passwordResetToken: undefined, passwordResetExpires: undefined },
      //   );
      //   throw error;
      // }
    },

    resetPassword: async (password, token) => {
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const user = await userModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {
          $gt: Date.now(),
        },
      });

      if (!user) {
        throw ApiError.badRequest(
          'User does not exist or the token already expires',
        );
      }

      user.password = password;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.changedPasswordAt = Date.now() - 1000;

      await user.save();
    },

    forgotPasswordError: async (id) => {
      await userModel.findByIdAndUpdate(id, {
        passwordResetToken: undefined,
        passwordResetExpires: undefined,
      });
    },
  };
};
