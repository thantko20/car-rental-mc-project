const nodemailer = require('nodemailer');
const {
  EMAIL_USERNAME,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_HOST,
} = require('../constants');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    port: EMAIL_PORT,
    auth: {
      user: EMAIL_USERNAME,
      pass: EMAIL_PASSWORD,
    },
    host: EMAIL_HOST,
  });
  // 2) Define the email options
  const mailOptions = {
    from: 'Thant Ko Zaw <thantmkou10@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email.
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
