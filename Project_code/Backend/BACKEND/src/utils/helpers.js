const bcrypt = require("bcrypt");
const fs = require("fs");
const nodemailer = require("nodemailer");
const config = require("../config");
const { getDateIST, getTimeIST } = require("./getIstDateTime");
const saltRounds = 10;

exports.hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

exports.comparePassword = (plain, hashed) => bcrypt.compareSync(plain, hashed);

// Function to send email to User when Loan is accepted or rejected
exports.sendLoanUpdateStatusEmail = async (email, status, name, loan) => {
  console.log("dedededee  ", email, status, name, loan);
  let Loandate = getDateIST(loan.createdAt);
  let LoanTime = getTimeIST(loan.createdAt);
  // Read email template from file
  let template = fs.readFileSync("./src/templates/Loan-Status.html", "utf8");
  console.log("Inside the LoanUpdate");
  // Replace placeholders with actual data
  template = template.replace("{{name}}", name);
  template = template.replace("{{amount}}", loan.amount);
  template = template.replace("{{status}}", status);
  template = template.replace("{{date}}", Loandate);
  template = template.replace("{{time}}", LoanTime);

  const transporter = nodemailer.createTransport(config.SMTP_URL, {});

  const mailOptions = {
    from: process.env.MAIL_FROM || "yenumulasrirambrahmareddy@gmail.com",
    to: email,
    subject: `Your Loan has been ${status}`,
    html: template,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Function to send email to User when his/her Registration Successfull
exports.sendRegistrationEmail = async (email, name) => {
  console.log("dedededee  ", email, name);

  // Read email template from file
  let template = fs.readFileSync(
    "./src/templates/Registration-Successful.html",
    "utf8"
  );
  console.log("Inside the Registration Email");

  template = template.replace("{{name}}", name);

  const transporter = nodemailer.createTransport(config.SMTP_URL, {});

  const mailOptions = {
    from: process.env.MAIL_FROM || "yenumulasrirambrahmareddy@gmail.com",
    to: email,
    subject: `Your Registration Successful`,
    html: template,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Send OTP email verification for forgot password
exports.sendOTPEmail = async (email, OTP) => {
  // Read email template from file
  let template = fs.readFileSync(
    "./src/templates/OTP-Verification.html",
    "utf8"
  );
  console.log("Inside the OTP SENDING Email");
  template = template.replace("{{otp}}", OTP);
  const transporter = nodemailer.createTransport(config.SMTP_URL, {});

  const mailOptions = {
    from: process.env.MAIL_FROM || "yenumulasrirambrahmareddy@gmail.com",
    to: email,
    subject: `OTP`,
    html: template,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Send Debited Amount email to Particular User
exports.sendDebitEmail = async (
  name,
  email,
  amount,
  date,
  balance,
  accountNumber,
  transactionid
) => {
  // Read email template from file
  let template = fs.readFileSync("./src/templates/Debit-Amount.html", "utf8");
  console.log("Inside the Debit SENDING Email");
  template = template.replace("{{name}}", name);
  template = template.replace("{{amount}}", amount);
  template = template.replace("{{account_number}}", accountNumber);
  template = template.replace("{{date}}", date);
  template = template.replace("{{balance}}", balance);
  template = template.replace("{{transaction_id}}", transactionid);
  const transporter = nodemailer.createTransport(config.SMTP_URL, {});

  const mailOptions = {
    from: process.env.MAIL_FROM || "no-reply@yourapp.com",
    to: email,
    subject: `DEBIT`,
    html: template,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Send Credited Amount email to Particular User
exports.sendCreditEmail = async (
  name,
  email,
  amount,
  date,
  balance,
  accountNumber,
  transactionid
) => {
  // Read email template from file
  let template = fs.readFileSync("./src/templates/Credit-Amount.html", "utf8");
  console.log("Inside the Credit SENDING Email");
  template = template.replace("{{name}}", name);
  template = template.replace("{{amount}}", amount);
  template = template.replace("{{account_number}}", accountNumber);
  template = template.replace("{{date}}", date);
  template = template.replace("{{balance}}", balance);
  template = template.replace("{{transaction_id}}", transactionid);
  const transporter = nodemailer.createTransport(config.SMTP_URL, {});
  console.log("Mail sent", email)
  const mailOptions = {
    from: process.env.MAIL_FROM || "no-reply@yourapp.com",
    to: email,
    subject: `CREDIT`,
    html: template,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Send Transfer Amount email to Particular User
exports.sendTransferEmail = async (
  name,
  email,
  amount,
  date,
  balance,
  accountNumber,
  transactionid,
  destinationAccount
) => {
  // Read email template from file
  let template = fs.readFileSync("./src/templates/TransferAmount.html", "utf8");
  console.log("Inside the Transfer SENDING Email");
  template = template.replace("{{name}}", name);
  template = template.replace("{{amount}}", amount);
  template = template.replace("{{account_number}}", accountNumber);
  template = template.replace("{{date}}", date);
  template = template.replace("{{balance}}", balance);
  template = template.replace("{{transaction_id}}", transactionid);

  template = template.replace(
    "{{recipient_account_number}}",
    destinationAccount
  );
  const transporter = nodemailer.createTransport(config.SMTP_URL, {});

  const mailOptions = {
    from: process.env.MAIL_FROM || "no-reply@yourapp.com",
    to: email,
    subject: `TRANSFER`,
    html: template,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Send Debit Card Applied Successfully
exports.sendAppliedDebitCardEmail = async (name, email) => {
  // Read email template from file
  let template = fs.readFileSync("./src/templates/DebitCardApply.html", "utf8");
  console.log("Inside the Debit Card Applied SENDING Email");
  template = template.replace("{{name}}", name);
  const transporter = nodemailer.createTransport(config.SMTP_URL, {});

  const mailOptions = {
    from: process.env.MAIL_FROM || "no-reply@yourapp.com",
    to: email,
    subject: `DEBIT CARD APPLIED SUCCESSFULLY`,
    html: template,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Sending the Debit Card Status
exports.sendDebitCardStatusEmail = async (name, email, status) => {
  // Read email template from file
  let template = fs.readFileSync(
    "./src/templates/DebitCardStatus.html",
    "utf8"
  );
  console.log("Inside the Debit Card Status SENDING Email");
  template = template.replace("{{name}}", name);
  template = template.replace("{{status}}", status);
  const transporter = nodemailer.createTransport(config.SMTP_URL, {});

  const mailOptions = {
    from: process.env.MAIL_FROM || "no-reply@yourapp.com",
    to: email,
    subject: `DEBIT CARD STATUS`,
    html: template,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Sending the Debit Card Rejection Status
exports.sendDebitCardRejectEmail = async (name, email, status) => {
  // Read email template from file
  let template = fs.readFileSync(
    "./src/templates/DebitCardReject.html",
    "utf8"
  );
  console.log("Inside the Debit Card Status SENDING Email");
  template = template.replace("{{name}}", name);
  template = template.replace("{{status}}", status);
  const transporter = nodemailer.createTransport(config.SMTP_URL, {});

  const mailOptions = {
    from: process.env.MAIL_FROM || "no-reply@yourapp.com",
    to: email,
    subject: `DEBIT CARD STATUS`,
    html: template,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
