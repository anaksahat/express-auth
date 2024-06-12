const { checkSchema } = require('express-validator');

const schema = {
  email: {
    in: ['body'],
    notEmpty: {
      errorMessage: "Email must not be empty",
    },
    isEmail: {
      errorMessage: "Must be a valid Email",
    },
    isLength: {
      options: {
        max: 255,
      },
      errorMessage: "Email not more than 255 characters",
    },
  },
  password: {
    in: ['body'],
    notEmpty: {
      errorMessage: "Password must not be empty",
    },
    isLength: {
      options: {
        min: 6,
        max: 128,
      },
      errorMessage: "Password must be 6-128 characters",
    },
  },
};

module.exports = checkSchema;
