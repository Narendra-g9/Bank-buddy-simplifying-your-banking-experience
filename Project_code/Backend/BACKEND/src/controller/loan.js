const { verifyAdminToken, verifyUserToken } = require("../middlewares/verifyTokens");
const { Account, Loan, User } = require("../schema/usersSchema");
const { getDateIST, getTimeIST } = require("../utils/getIstDateTime");
const { sendLoanUpdateStatusEmail } = require("../utils/helpers");

// Create a new loan application
const createLoan = async (req, res) => {
  const { amount, interestRate, term, loanType } = req.body;
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ msg: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyUserToken(token);
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
    res.status(201).send({ msg: "Loan application created successfully.", loan: newLoan });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

// Get all loans for admin
const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate("user", "firstname lastname");
    const formattedLoans = loans.map((loan) => ({
      ...loan.toObject(),
      createdAt: getDateIST(loan.createdAt) + " " + getTimeIST(loan.createdAt),
      updatedAt: getDateIST(loan.updatedAt) + " " + getTimeIST(loan.updatedAt),
    }));
    res.send(formattedLoans);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

// Update loan status (accept/reject)
const updateLoanStatus = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ msg: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];
  const { loanId } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).send({ msg: "Invalid status. Must be accepted or rejected." });
  }

  try {
    const decoded = verifyAdminToken(token);
    if (!decoded) {
      return res.status(401).send({ msg: "Access Token is Invalid" });
    }

    const loan = await Loan.findByIdAndUpdate(
      loanId,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!loan) {
      return res.status(404).send({ msg: "Loan not found." });
    }

    const userDetails = await User.findOne({ _id: loan.user });
    if (status === "accepted") {
      const accountDetails = await Account.findOne({ accUser: loan.user });
      accountDetails.accBalance += Number(loan.amount);
      await accountDetails.save();
      const name = `${userDetails.firstname} ${userDetails.lastname}`;
      if (accountDetails) {
        sendLoanUpdateStatusEmail(userDetails?.email, status, name, loan);
      }
    } else if (status === "rejected") {
      const name = `${userDetails.firstname} ${userDetails.lastname}`;
      sendLoanUpdateStatusEmail(userDetails?.email, status, name, loan);
    }

    res.send({ msg: "Loan status updated successfully.", loan });
  } catch (err) {
    console.error("Error updating loan status:", err);
    res.status(400).send({ error: err.message });
  }
};

// Get the loan details by userId
const getMyLoans = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ msg: "Authorization header is missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyUserToken(token);
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
    res.status(400).send({ error: err.message });
  }
};

module.exports = {
  createLoan,
  getAllLoans,
  updateLoanStatus,
  getMyLoans,
};
