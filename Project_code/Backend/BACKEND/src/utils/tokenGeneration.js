const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("../config");

// Admin_tokens
exports.adminTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    config.ADMIN_ACCESS_TOKEN_SECRET,
    { expiresIn: config.ACCESS_TOKEN_EXPIRY }
  );

  return { accessToken };
};

// Customer_tokens
exports.userTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    config.USER_ACCESS_TOKEN_SECRET,
    { expiresIn: config.ACCESS_TOKEN_EXPIRY }
  );

  return { accessToken };
};
