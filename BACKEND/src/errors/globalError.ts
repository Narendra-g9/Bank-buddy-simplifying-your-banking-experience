import { NextFunction, Request, Response } from "express";

export const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err) {
    console.log(err);
    res.status(500).send({ msg: "Something Went Wrong", err });
  }
};
