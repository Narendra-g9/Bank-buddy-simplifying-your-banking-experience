const jwt = require("jsonwebtoken");
const config = require("../config");

// User Token Verification
export const verifyUserToken = (token) => {
  let validToken = false;
  try {
    const decoded = jwt.verify(token, config.USER_ACCESS_TOKEN_SECRET);
    if (decoded) {
      return decoded;
    }
  } catch (error) {
    console.error("Error verifying user token:", error);
  }
  return validToken;
};

// Admin Token Verification
export const verifyAdminToken = (token) => {
  let validToken = false;
  try {
    const decoded = jwt.verify(token, config.ADMIN_ACCESS_TOKEN_SECRET);
    if (decoded) {
      return decoded;
    }
  } catch (error) {
    console.error("Error verifying admin token:", error);
  }
  return validToken;
};
