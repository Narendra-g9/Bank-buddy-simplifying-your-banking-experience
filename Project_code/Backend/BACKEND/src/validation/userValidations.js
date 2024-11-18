const commonValidation = {
  username: {
    notEmpty: true,
    isString: {
      errorMessage: "Username Must be a String",
    },
    isLength: {
      options: {
        min: 5,
        max: 20,
      },
      errorMessage: "username min 5 and max 20 characters",
    },
  },
  password: {
    notEmpty: true,
    isLength: {
      options: {
        min: 6,
        max: 32,
      },
      errorMessage: "Password Must be a length min 6 and max 32",
    },
  },
};

const emailValidation = {
  email: {
    isEmail: {
      errorMessage: "pls check your Email",
    },
  },
};

const AdminRegisterValidation = {
  ...commonValidation,
  ...emailValidation,
};

module.exports = {
  commonValidation,
  emailValidation,
  AdminRegisterValidation,
};
