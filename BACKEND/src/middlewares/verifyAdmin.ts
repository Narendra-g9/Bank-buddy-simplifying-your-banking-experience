import { NextFunction, Request, Response } from "express";
import { verifyAdminToken } from "./verifyTokens";

export const verifyAdmin = (
  req,
  res,
  next
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ msg: "Authorization header is missing" });
  }
  const token = authHeader.split(" ")[1];
  const decoded = verifyAdminToken(token);
  if (!decoded) {
    return res.status(401).send({ msg: "Access denied. Admins only." });
  }
  next();
};
