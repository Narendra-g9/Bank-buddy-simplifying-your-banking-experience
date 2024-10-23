import { verifyAdminToken, verifyUserToken } from "../middlewares/verifyTokens";

import { Request, Response } from "express";
import { Account, Loan, User } from "../schema/usersSchema";
import { getDateIST, getTimeIST } from "../utils/getIstDateTime";
import { sendLoanUpdateStatusEmail } from "../utils/helpers";

// Create a new loan application
export const createLoan = async (req: Request, res: Response): Promise<any> => {
  const { amount, interestRate, term, loanType } = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ msg: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = verifyUserToken(token);
    if (!decoded) {
      return res.status(401).send({ msg: "Access Token is Invalid" });
    }

    const userid = decoded.id;
    const newLoan = new Loan({
      user: userid,
      amount,
      interestRate,
      term,
      loanType,
    });
    await newLoan.save();
    res
      .status(201)
      .send({ msg: "Loan application created successfully.", loan: newLoan });
  } catch (err: any) {
    res.status(400).send({ error: err.message });
  }
};

// Get all loans for admin
export const getAllLoans = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const loans = await Loan.find().populate("user", "firstname lastname");
    const formattedLoans = loans.map((loan) => ({
      ...loan.toObject(),
      createdAt: getDateIST(loan.createdAt) + " " + getTimeIST(loan.createdAt),
      updatedAt: getDateIST(loan.updatedAt) + " " + getTimeIST(loan.updatedAt),
    }));
    res.send(formattedLoans);
  } catch (err: any) {
    res.status(400).send({ error: err.message });
  }
};

// Update loan status (accept/reject)
export const updateLoanStatus = async (
  req: Request,
  res: Response
): Promise<any> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ msg: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];
  const { loanId } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res
      .status(400)
      .send({ msg: "Invalid status. Must be accepted or rejected." });
  }

  try {
    console.log("Verifying token:", token);
    const decoded: any = verifyAdminToken(token);
    if (!decoded) {
      return res.status(401).send({ msg: "Access Token is Invalid" });
    }
    console.log("After decoded");

    const adminid = decoded.id;

    const loan = await Loan.findByIdAndUpdate(
      loanId,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!loan) {
      return res.status(404).send({ msg: "Loan not found." });
    }
    const userDetails: any = await User.findOne({ _id: loan.user });
    if (status === "accepted") {
      const accountDetails: any = await Account.findOne({ accUser: loan.user });
      accountDetails.accBalance += Number(loan.amount);
      await accountDetails.save();
      let name = userDetails.firstname + " " + userDetails.lastname;
      if (accountDetails) {
        sendLoanUpdateStatusEmail(userDetails?.email, status, name, loan);
      }
    }
    if (status === "rejected") {
      let name = userDetails.firstname + " " + userDetails.lastname;
      if (status) {
        sendLoanUpdateStatusEmail(userDetails?.email, status, name, loan);
      }
    }
    res.send({ msg: "Loan status updated successfully.", loan });
  } catch (err: any) {
    console.error("Error updating loan status:", err);
    res.status(400).send({ error: err.message });
  }
};

// Get the Loan details by userId
export const getMyLoans = async (req: Request, res: Response): Promise<any> => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ msg: "Authorization header is missing" });
  }
  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = verifyUserToken(token);
    if (!decoded) {
      return res.status(401).send({ msg: "Access Token is Invalid" });
    }

    const userid = decoded.id;
    const loans = await Loan.find({ user: userid });
    const formattedLoans = loans.map((loan) => ({
      ...loan.toObject(),
      createdAt: getDateIST(loan.createdAt) + " " + getTimeIST(loan.createdAt),
      updatedAt: getDateIST(loan.updatedAt) + " " + getTimeIST(loan.updatedAt),
    }));
    res.send(formattedLoans);
  } catch (err: any) {
    res.status(400).send({ error: err.message });
  }
};
