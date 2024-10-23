import { NextFunction, Request, Response } from "express";
import { verifyAdminToken } from "./verifyTokens";

export const verifyAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ msg: "Authorization header is missing" });
  }
  const token = authHeader.split(" ")[1];
  const decoded: any = verifyAdminToken(token);
  if (!decoded) {
    return res.status(401).send({ msg: "Access denied. Admins only." });
  }
  next();
};
