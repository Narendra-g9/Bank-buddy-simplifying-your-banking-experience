export const commonValidation = {
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
      errorMessage: "Password Must be a length min 10 and max 32",
    },
  },
};

export const emailValidation = {
  email: {
    isEmail: {
      errorMessage: "pls check your Email",
    },
  },
};
export const AdminRegisterValidation = {
  ...commonValidation,
  ...emailValidation,
};
