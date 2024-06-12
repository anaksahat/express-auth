const { checkSchema } = require('express-validator');

const schema = {
  Username: {
    in: ['body'],
    notEmpty: {
      errorMessage: "Must be not empty",
    },
    isLength: {
      options: {
        min: 3,
        max: 255,
      },
      errorMessage: "At least must be 3-255 Characters",
    },
  },
  Email: {
    in: ['body'],
    notEmpty: {
      errorMessage: "Must be not empty",
    },
    isEmail: {
      errorMessage: "Must be valid Email",
    },
    isLength: {
      options: {
        max: 255,
      },
      errorMessage: "Email not more than 255 Characters",
    },
  },
  Password: {
    in: ['body'],
    notEmpty: {
      errorMessage: "Must be not empty",
    },
    isLength: {
      options: {
        min: 6,
        max: 128,
      },
      errorMessage: "At least must be 6-255 Characters",
    },
  },
};

module.exports = checkSchema;
