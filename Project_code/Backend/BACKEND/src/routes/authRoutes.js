const express = require("express");
const { AdminRegisterValidation } = require("../validation/userValidations");
const adminController = require("../controller/admin");
const userController = require("../controller/user");
const { checkSchema } = require("express-validator");
const {
  createLoan,
  getAllLoans,
  getMyLoans,
  updateLoanStatus,
} = require("../controller/loan");
const { verifyAdmin } = require("../middlewares/verifyAdmin");
const { sendOTP } = require("../controller/forgotPassword");
const { OTPverification } = require("../controller/resetPassword");

const router = express.Router();

// Admin Register
router.get(
  "/admin/register",
  checkSchema(AdminRegisterValidation),
  adminController.registerAdmin
);

// Admin Login
router.post("/admin/login", adminController.adminLogin);

// User Register
router.post("/user/register", userController.registerUser);

// View All users
router.get("/getallusers", adminController.viewAllUsers);

// User Login
router.post("/user/login", userController.userLogin);

// Credit the Amount
router.post("/creditamount", userController.creditAmount);

// Debit Amount
router.post("/debitamount", userController.debitAmount);

// Transfer Amount
router.post("/transferamount", userController.transferAmount);

// Get all Credit Transactions Based on userId
router.get("/credittransactions", userController.getAllCreditTransactions);

// Get all Debit Transactions Based on userId
router.get("/debittransactions", userController.getAllDebitTransactions);

// Get all Transfer Transactions Based on userId
router.get("/transfertransactions", userController.getAllTransferTransactions);

// Get account details based on Account Number
router.get("/getAccountdetails/:accountnumber", userController.getAccount);

// Get profile With Accounts
router.get("/getprofileaccount", userController.getProfileWithAccount);

// Get All Transactions History based on from date to to Date
router.get("/transactions", userController.getTransactionsByDateRange);

// Route to create a loan application
router.post("/applyloan", createLoan);

// Route to get all loans (admin)
router.get("/loans", verifyAdmin, getAllLoans);

// Get Loan detail for particular user
router.get("/getmyloans", getMyLoans);

// Route to update loan status (accept/reject)
router.patch("/loans/status/:loanId", verifyAdmin, updateLoanStatus);

// Send OTP
router.post("/sendotp", sendOTP);

// OTP verification
router.post("/otpverify", OTPverification);

// Apply For Debit card
router.post("/apply/debitcard", userController.applyDebit);

// Check if the Debit card is Present or Not
router.get("/isDebitCard", userController.checkDebitCard);

// Get the Debit card Details
router.get("/getDebitCard", userController.getDebitCardDetails);

// Get all the Pending Debit cards
router.get("/getallDebitCards", adminController.getAllPendingDebitCards);

// Admin can check the Debit card and can Accept or Reject
router.patch(
  "/updatedebit",
  verifyAdmin,
  adminController.reviewDebitCardApplication
);

// Get Email of the User
router.get("/getEmail", userController.getEmail);

module.exports = router;
