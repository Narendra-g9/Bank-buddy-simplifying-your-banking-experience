import { verifyAdminToken, verifyUserToken } from "../middlewares/verifyTokens";

import { Request, Response } from "express";
import { Account, Loan, User } from "../schema/usersSchema";
import { getDateIST, getTimeIST } from "../utils/getIstDateTime";
import { sendLoanUpdateStatusEmail, sendAdminLoanApplicationNotification } from "../utils/helpers";

// Create a new loan application
export const createLoan = async (req, res) => {
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
    const userDetails = await User.findOne({ _id: userid });
    
    const newLoan = new Loan({
      user: userid,
      amount,
      interestRate,
      term,
      loanType,
    });
    await newLoan.save();
    
    // Send admin notification
    if (userDetails) {
      let userName = (userDetails?.firstname || "") + " " + (userDetails?.lastname || "");
      let userEmail = userDetails?.email || "";
      let date = getDateIST(newLoan.createdAt) + " " + getTimeIST(newLoan.createdAt);
      sendAdminLoanApplicationNotification(userName, userEmail, amount, loanType, date).catch((err) => console.error("Admin loan notification failed (non-blocking):", err.message));
    }
    
    res
      .status(201)
      .send({ msg: "Loan application created successfully.", loan: newLoan });
  } catch (err) {
    res.status(400).send({ error: (err as Error).message });
  }
};

// Get all loans for admin
export const getAllLoans = async (
  req,
  res
) => {
  try {
    const loans = await Loan.find().populate("user", "firstname lastname");
    const formattedLoans = loans.map((loan) => ({
      ...loan.toObject(),
      createdAt: getDateIST(loan.createdAt) + " " + getTimeIST(loan.createdAt),
      updatedAt: getDateIST(loan.updatedAt) + " " + getTimeIST(loan.updatedAt),
    }));
    res.send(formattedLoans);
  } catch (err) {
    res.status(400).send({ error: (err as Error).message });
  }
};

// Update loan status (accept/reject)
export const updateLoanStatus = async (
  req,
  res
) => {
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
    const userDetails = await User.findOne({ _id: loan.user });
    if (!userDetails) {
      return res.status(404).send({ msg: "User not found." });
    }
    if (status === "accepted") {
      const accountDetails = await Account.findOne({ accUser: loan.user });
      if (!accountDetails) {
        return res.status(404).send({ msg: "Account not found." });
      }
      accountDetails.accBalance += Number(loan.amount);
      await accountDetails.save();
      let name = (userDetails?.firstname || "") + " " + (userDetails?.lastname || "");
      if (accountDetails) {
        sendLoanUpdateStatusEmail(userDetails?.email || "", status, name, loan).catch((err) => console.error("Loan status email failed (non-blocking):", err.message));
      }
    }
    if (status === "rejected") {
      let name = (userDetails?.firstname || "") + " " + (userDetails?.lastname || "");
      if (status) {
        sendLoanUpdateStatusEmail(userDetails?.email || "", status, name, loan).catch((err) => console.error("Loan rejection email failed (non-blocking):", err.message));
      }
    }
    res.send({ msg: "Loan status updated successfully.", loan });
  } catch (err) {
    console.error("Error updating loan status:", err);
    res.status(400).send({ error: (err as Error).message });
  }
};

// Get the Loan details by userId
export const getMyLoans = async (req, res) => {
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
  } catch (err) {
    res.status(400).send({ error: (err as Error).message });
  }
};
