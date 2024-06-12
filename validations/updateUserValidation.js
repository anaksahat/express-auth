const { checkSchema } = require('express-validator');

const schema = {
  name: {
    in: ['body'],
    optional: { options: { nullable: true } },
    isLength: {
      options: {
        min: 3,
        max: 255,
      },
      errorMessage: "Username must be 3-255 characters long",
    },
  },
  email: {
    in: ['body'],
    optional: { options: { nullable: true } },
    isEmail: {
      errorMessage: "Must be a valid email",
    },
    isLength: {
      options: {
        max: 255,
      },
      errorMessage: "Email must not be more than 255 characters",
    },
  },
  password: {
    in: ['body'],
    optional: { options: { nullable: true } },
    isLength: {
      options: {
        min: 6,
        max: 128,
      },
      errorMessage: "Password must be 6-128 characters long",
    },
  },
};

module.exports = checkSchema;
