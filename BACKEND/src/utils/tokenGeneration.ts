import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import config from "../config";
export interface IAdmin {
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string;
}

// Admin_tokens
export const adminTokens = (user: IAdmin) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    config.ADMIN_ACCESS_TOKEN_SECRET,
    { expiresIn: config.ACCESS_TOKEN_EXPIRY }
  );

  return { accessToken };
};

// Customer_tokens
export const userTokens = (user: IAdmin) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    config.USER_ACCESS_TOKEN_SECRET,
    { expiresIn: config.ACCESS_TOKEN_EXPIRY }
  );

  return { accessToken };
};
