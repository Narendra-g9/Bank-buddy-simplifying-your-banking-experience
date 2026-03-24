import bcrypt from "bcrypt";
import fs from "fs";
import nodemailer from "nodemailer";
import config from "../config";
import { getDateIST, getTimeIST } from "./getIstDateTime";
const saltRounds = 10;

export const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

export const comparePassword = (plain: string, hashed: string) =>
  bcrypt.compareSync(plain, hashed);

// Function to send email to User when Loan is accepted or rejected
export const sendLoanUpdateStatusEmail = async (
  email: string,
  status: string,
  name: string,
  loan: any
) => {
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
export const sendRegistrationEmail = async (email: string, name: string) => {
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
export const sendOTPEmail = async (email: string, OTP: string) => {
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

// Send Debited Amount  email to Paricular User
export const sendDebitEmail = async (
  name: string,
  email: string,
  amount: any,
  date: string,
  balance: any,
  accountNumber: string,
  transactionid: any
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

// Send Credited Amount  email to Paricular User
export const sendCreditEmail = async (
  name: string,
  email: string,
  amount: any,
  date: string,
  balance: any,
  accountNumber: string,
  transactionid: any
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
// Send Transfer Amount  email to Paricular User
export const sendTransferEmail = async (
  name: string,
  email: string,
  amount: any,
  date: string,
  balance: any,
  accountNumber: string,
  transactionid: any,
  destinationAccount: any
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

// Send Debit Card  Applied Successfully
export const sendAppliedDebitCardEmail = async (
  name: string,
  email: string
) => {
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
export const sendDebitCardStatusEmail = async (
  name: string,
  email: string,
  status: string
) => {
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
export const sendDebitCardRejectEmail = async (
  name: string,
  email: string,
  status: string
) => {
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

// Send Admin Notification for Credit Transaction
export const sendAdminCreditNotification = async (
  userName: string,
  amount: any,
  accountNumber: string,
  date: string
) => {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  const transporter = nodemailer.createTransport(config.SMTP_URL, {});
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: white; padding: 20px; border-radius: 8px;">
        <h2 style="color: #27ae60;">💳 Credit Transaction Notification</h2>
        <p><strong>User:</strong> ${userName}</p>
        <p><strong>Amount:</strong> ₹${amount}</p>
        <p><strong>Account Number:</strong> ${accountNumber}</p>
        <p><strong>Date & Time:</strong> ${date}</p>
        <p style="color: #666; margin-top: 20px;">This is an automated notification from Bank Buddy System.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.MAIL_FROM || "no-reply@yourapp.com",
    to: adminEmail,
    subject: `[ADMIN ALERT] Credit Transaction - ${userName}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Admin notification sent to ${adminEmail}`);
  } catch (error) {
    console.error("Error sending admin notification:", error);
  }
};

// Send Admin Notification for Debit Transaction
export const sendAdminDebitNotification = async (
  userName: string,
  amount: any,
  accountNumber: string,
  date: string
) => {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  const transporter = nodemailer.createTransport(config.SMTP_URL, {});
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: white; padding: 20px; border-radius: 8px;">
        <h2 style="color: #e74c3c;">💸 Debit Transaction Notification</h2>
        <p><strong>User:</strong> ${userName}</p>
        <p><strong>Amount:</strong> ₹${amount}</p>
        <p><strong>Account Number:</strong> ${accountNumber}</p>
        <p><strong>Date & Time:</strong> ${date}</p>
        <p style="color: #666; margin-top: 20px;">This is an automated notification from Bank Buddy System.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.MAIL_FROM || "no-reply@yourapp.com",
    to: adminEmail,
    subject: `[ADMIN ALERT] Debit Transaction - ${userName}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Admin notification sent to ${adminEmail}`);
  } catch (error) {
    console.error("Error sending admin notification:", error);
  }
};

// Send Admin Notification for Transfer Transaction
export const sendAdminTransferNotification = async (
  userName: string,
  amount: any,
  fromAccount: string,
  toAccount: string,
  date: string
) => {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) return;

  const transporter = nodemailer.createTransport(config.SMTP_URL, {});
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <div style="background-color: white; padding: 20px; border-radius: 8px;">
        <h2 style="color: #3498db;">🔄 Transfer Transaction Notification</h2>
        <p><strong>User:</strong> ${userName}</p>
        <p><strong>Amount:</strong> ₹${amount}</p>
        <p><strong>From Account:</strong> ${fromAccount}</p>
        <p><strong>To Account:</strong> ${toAccount}</p>
        <p><strong>Date & Time:</strong> ${date}</p>
        <p style="color: #666; margin-top: 20px;">This is an automated notification from Bank Buddy System.</p>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.MAIL_FROM || "no-reply@yourapp.com",
    to: adminEmail,
    subject: `[ADMIN ALERT] Transfer Transaction - ${userName}`,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Admin notification sent to ${adminEmail}`);
  } catch (error) {
    console.error("Error sending admin notification:", error);
  }
};
