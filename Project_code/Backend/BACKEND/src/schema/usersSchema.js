const mongoose = require("mongoose");

// Admin Schema
const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is Required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is Required"],
    unique: true,
  },
  password: { type: String, required: [true, "password is Required"] },
  role: {
    type: Number,
    enum: [1],
    default: 1,
  },
});

// User Schema
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  otherName: {
    type: String,
    default: null,
  },
  gender: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  stateofOrigin: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  alternativePhoneNumber: {
    type: String,
    default: null,
  },
  role: {
    type: Number,
    enum: [2],
    default: 2,
  },
});

const accountSchema = new mongoose.Schema({
  accNumber: {
    type: String,
  },
  accUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  accHolder: {
    type: String,
  },
  accBalance: {
    type: Number,
    default: 0,
  },
});

const creditTransactionsSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
  },
  accUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: {
    type: Number,
  },
  date: {
    type: Date,
    default: () => new Date(),
  },
});

const debitTransactionsSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
  },
  accUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: {
    type: Number,
  },
  date: {
    type: Date,
    default: () => new Date(),
  },
});

const transferTransactionsSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
  },
  accUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  destinationAccount: {
    type: String,
  },
  destUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  amount: {
    type: Number,
  },
  date: {
    type: Date,
    default: () => new Date(),
  },
});

// Loan Schema
const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  interestRate: {
    type: Number,
    required: true,
  },
  term: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  loanType: {
    type: String,
    enum: [
      "Home",
      "Education",
      "Gold",
      "Vehicle",
      "Personal",
      "Business",
      "Medical",
      "Agricultural",
      "Travel",
      "Debt Consolidation",
    ],
    required: true,
  },

  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 1,
  },
});

const debitCardSchema = new mongoose.Schema({
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  cardNumber: {
    type: String,
    default: "",
  },
  cardHolder: {
    type: String,
  },
  cvv: {
    type: String,
    default: "",
  },
  expiryDate: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => new Date(),
  },
});

const Admin = mongoose.model("Admin", adminSchema);
const User = mongoose.model("User", userSchema);
const Account = mongoose.model("Account", accountSchema);
const Credit = mongoose.model("Credit", creditTransactionsSchema);
const Debit = mongoose.model("Debit", debitTransactionsSchema);
const Transfer = mongoose.model("Transfer", transferTransactionsSchema);
const Loan = mongoose.model("Loan", loanSchema);
const OTP = mongoose.model("OTP", otpSchema);
const DebitCard = mongoose.model("DebitCard", debitCardSchema);

module.exports = { Admin, User, Account, Credit, Debit, Transfer, Loan, OTP, DebitCard };
