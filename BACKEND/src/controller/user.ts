import {
  Account,
  Credit,
  Debit,
  DebitCard,
  Transfer,
  User,
} from "../schema/usersSchema";
import { Request, Response } from "express";
import {
  comparePassword,
  hashPassword,
  sendAppliedDebitCardEmail,
  sendCreditEmail,
  sendDebitEmail,
  sendRegistrationEmail,
  sendTransferEmail,
  sendAdminCreditNotification,
  sendAdminDebitNotification,
  sendAdminTransferNotification,
  sendAdminDebitCardApplicationNotification,
} from "../utils/helpers";
import { userTokens } from "../utils/tokenGeneration";
import { verifyUserToken } from "../middlewares/verifyTokens";
import { getDateIST, getTimeIST } from "../utils/getIstDateTime";
import QRCode from "qrcode";

// Function to generate a unique bank account number
const generateAccountNumber = async () => {
  let accountNumber;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random 10-digit account number
    accountNumber =
      "100" +
      Math.floor(Math.random() * 1000000000)
        .toString()
        .padStart(9, "0");

    const existingAccount = await Account.findOne({ accNumber: accountNumber });
    if (!existingAccount) {
      isUnique = true;
    }
  }

  return accountNumber;
};

// User registering
export const registerUser = async (
  req,
  res
) => {
  const {
    firstname,
    lastname,
    otherName = null,
    gender,
    address,
    stateofOrigin,
    password,
    email,
    phoneNumber,
    alternativePhoneNumber = null,
  } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) return res.status(401).send({ msg: "User already exists" });

    const hashedPassword = hashPassword(password);

    const newUser = new User({
      firstname,
      lastname,
      otherName,
      gender,
      address,
      stateofOrigin,
      password: hashedPassword,
      email,
      phoneNumber,
      alternativePhoneNumber,
    });

    const savedUser = (await newUser.save()).toObject();
    if (savedUser) {
      let name = firstname + " " + lastname;
      sendRegistrationEmail(email, name);
    }
    // Generate unique account number
    const accNumber = await generateAccountNumber();

    // Create account for the user
    const newAccount = new Account({
      accNumber,
      accUser: savedUser._id,
      accHolder: `${firstname} ${lastname}`,
      accBalance: 0,
    });

    const savedData = (await newAccount.save()).toObject();

    return res.status(201).send({
      msg: `Registered Successfully ✅. Please login ${savedUser.firstname} ${savedUser.lastname}`,
      account: {
        accNumber: newAccount.accNumber,
        accHolder: newAccount.accHolder,
      },
    });
  } catch (err) {
    return res.status(400).send({ error: err });
  }
};
// Login the User
export const userLogin = async (req, res) => {
  try {
    const body = req.body;
    const pass = body.password;

    const findUser = await User.findOne({ email: body.email });

    if (!findUser) throw new Error("User not found");
    if (findUser.role !== 2) {
      throw new Error("Unauthorized: User access required");
    }

    if (!comparePassword(pass, findUser.password))
      throw new Error("Bad Credentials");

    const { password, ...user } = findUser.toObject();
    const { accessToken } = userTokens(findUser);
    return res.send({
      msg: "Login Successful",
      user,
      accessToken,
      role: findUser.role,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: (err as Error).message });
  }
};

// Credit the Amount
export const creditAmount = async (
  req,
  res
) => {
  const amount = Number(req.body.amount);
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
    const getAccount = await Account.findOne({ accUser: userid });
    if (!getAccount) {
      return res.status(404).send({ msg: "Account not found" });
    }
    getAccount.accBalance += amount;
    const savedAccount = await getAccount.save();

    const creditedTransaction = await Credit.create({
      accountNumber: getAccount.accNumber,
      amount: amount,
      accUser: getAccount.accUser,
    });
    const date = getDateIST(creditedTransaction?.date);
    const time = getTimeIST(creditedTransaction?.date);
    const userDetails = await User.findOne({ _id: userid });
    if (savedAccount) {
      let userFullName = (userDetails?.firstname || "") + " " + (userDetails?.lastname || "");
      let useremail = userDetails?.email || "";
      let dateTime = date + " " + time;
      let balance = savedAccount?.accBalance;
      let accountnumberis = savedAccount?.accUser?.toString() || "";
      let transactionID = creditedTransaction?._id;
      sendCreditEmail(
        userFullName,
        useremail,
        amount,
        dateTime,
        balance,
        accountnumberis,
        transactionID
      );
      // Send admin notification
      sendAdminCreditNotification(
        userFullName,
        amount,
        getAccount.accNumber || "",
        dateTime
      );
    }
    return res.send({ msg: "Credited Amount Successfully", savedAccount });
  } catch (err) {
    return res.status(400).send({ error: (err as Error).message });
  }
};

// Debit the Amount
export const debitAmount = async (
  req,
  res
) => {
  const amount = Number(req.body.amount);
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
    const getAccount = await Account.findOne({ accUser: userid });
    if (!getAccount) {
      return res.status(404).send({ msg: "Account not found" });
    }
    if (amount > getAccount.accBalance) {
      return res.send({ msg: `Your account balance is insufficient` });
    }
    getAccount.accBalance -= amount;
    const savedAccount = await getAccount.save();
    const debitedTransaction = await Debit.create({
      accountNumber: getAccount.accNumber,
      amount: amount,
      accUser: getAccount.accUser,
    });
    const date = getDateIST(debitedTransaction?.date);
    const time = getTimeIST(debitedTransaction?.date);
    const userDetails = await User.findOne({ _id: userid });
    if (savedAccount) {
      let userFullName = (userDetails?.firstname || "") + " " + (userDetails?.lastname || "");
      let useremail = userDetails?.email || "";
      let dateTime = date + " " + time;
      let balance = savedAccount?.accBalance;
      let accountnumberis = savedAccount?.accUser?.toString() || "";
      let transactionID = debitedTransaction?._id;
      sendDebitEmail(
        userFullName,
        useremail,
        amount,
        dateTime,
        balance,
        accountnumberis,
        transactionID
      );
      // Send admin notification
      sendAdminDebitNotification(
        userFullName,
        amount,
        getAccount.accNumber || "",
        dateTime
      );
    }
    return res.send({ msg: "Debited Amount Successfully", savedAccount });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: (err as Error).message });
  }
};

// Transfer the Amount
export const transferAmount = async (
  req,
  res
) => {
  const { destinationAccount } = req.body;
  const amount = Number(req.body.amount);
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
    const getsourceAccount = await Account.findOne({
      accUser: userid,
    });
    if (!getsourceAccount) {
      return res.status(404).send({ msg: "Source account not found" });
    }
    if (amount > getsourceAccount.accBalance) {
      return res.send({
        msg: `Your account balance is insufficient to transfer`,
      });
    }
    getsourceAccount.accBalance -= amount;
    const savedAccount = await getsourceAccount.save();
    const getdestinationAccount = await Account.findOne({
      accNumber: destinationAccount,
    });
    if (!getdestinationAccount) {
      return res.send({ msg: "Destination Account Not Found" });
    }
    getdestinationAccount.accBalance += amount;
    const saveddestinationAccount = await getdestinationAccount.save();
    const transferAmountTransaction = await Transfer.create({
      accountNumber: getsourceAccount.accNumber,
      destinationAccount: destinationAccount,
      accUser: getsourceAccount.accUser,
      destUser: getdestinationAccount.accUser,
      amount: amount,
    });
    const date = getDateIST(transferAmountTransaction?.date);
    const time = getTimeIST(transferAmountTransaction?.date);
    const userDetails = await User.findOne({ _id: userid });
    if (savedAccount) {
      let userFullName = (userDetails?.firstname || "") + " " + (userDetails?.lastname || "");
      let useremail = userDetails?.email || "";
      let dateTime = date + " " + time;
      let balance = savedAccount?.accBalance;
      let accountnumberis = savedAccount?.accUser?.toString() || "";
      let transactionID = transferAmountTransaction?._id;
      sendTransferEmail(
        userFullName,
        useremail,
        amount,
        dateTime,
        balance,
        accountnumberis,
        transactionID,
        destinationAccount
      );
      // Send admin notification
      sendAdminTransferNotification(
        userFullName,
        amount,
        getsourceAccount.accNumber || "",
        destinationAccount,
        dateTime
      );
    }

    res.send({
      msg: `Amount transfered from ${getsourceAccount.accNumber} to ${destinationAccount} Successful`,
    });
  } catch (err) {
    return res.status(400).send({ error: (err as Error).message });
  }
};

// Get all credit transactions based on accountId
export const getAllCreditTransactions = async (
  req,
  res
) => {
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
    const result = await Credit.find({ accUser: userid }).sort({ date: -1 });
    if (result.length === 0) {
      return res.send({
        msg: `No transactions Happened `,
      });
    }

    // Use Promise.all to wait for all promises to resolve
    const finalResult = result.map((eachItem) => {
      return {
        ...eachItem.toObject(),
        transactionDate: eachItem?.date ? getDateIST(eachItem.date) : null,
        transactionTime: eachItem?.date ? getTimeIST(eachItem.date) : null,
      };
    });

    res.send(finalResult);
  } catch (err) {
    return res.status(400).send({ error: (err as Error).message });
  }
};
// Get all Debit transactions based on accountId
export const getAllDebitTransactions = async (
  req,
  res
) => {
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
    const result = await Debit.find({ accUser: userid }).sort({ date: -1 });
    if (result.length === 0) {
      return res.send({
        msg: `No transactions Happened`,
      });
    }

    // Use Promise.all to wait for all promises to resolve
    const finalResult = result.map((eachItem) => {
      return {
        ...eachItem.toObject(),
        transactionDate: eachItem?.date ? getDateIST(eachItem.date) : null,
        transactionTime: eachItem?.date ? getTimeIST(eachItem.date) : null,
      };
    });

    res.send(finalResult);
  } catch (err) {
    return res.status(400).send({ error: (err as Error).message });
  }
};
// Get all Transfer transactions based on accountId
export const getAllTransferTransactions = async (
  req,
  res
) => {
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
    const result = await Transfer.find({ accUser: userid }).sort({ date: -1 });
    if (result.length === 0) {
      return res.send({
        msg: `No Transfer transactions Happened `,
      });
    }

    // Use Promise.all to wait for all promises to resolve
    const finalResult = result.map((eachItem) => {
      return {
        ...eachItem.toObject(),
        transactionDate: eachItem?.date ? getDateIST(eachItem.date) : null,
        transactionTime: eachItem?.date ? getTimeIST(eachItem.date) : null,
      };
    });

    res.send(finalResult);
  } catch (err) {
    return res.status(400).send({ error: (err as Error).message });
  }
};

// Get the profile History and Balance
export const getProfileWithAccount = async (
  req,
  res
) => {
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
    const getUserDetails = await Account.findOne({ accUser: userid }).populate(
      "accUser",
      "firstname lastname otherName gender address stateofOrigin email phoneNumber alternativePhoneNumber"
    );

    if (!getUserDetails) {
      return res.status(404).send({ msg: "Account not found" });
    }

    const accNumber = getUserDetails.accNumber;
    if (!accNumber) {
      return res.status(400).send({ msg: "Account number is not available" });
    }
    const qrCodeData = await QRCode.toDataURL(accNumber);
    const data = {
      ...getUserDetails.toObject(),
      qrCode: qrCodeData,
    };
    return res.send({
      userDetails: data,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(400).send({ error: (err as Error).message });
  }
};

// Get account details based on Account Number
export const getAccount = async (req, res) => {
  const accountid = req.params.accountnumber;
  try {
    const result = await Account.findOne({ accNumber: accountid }).select(
      "accHolder"
    );
    if (!result) {
      return res.status(404).send({ msg: "Account not found" });
    }
    const { accHolder } = result;
    return res.send(accHolder);
  } catch (err) {
    console.error("Error:", err);
    return res.status(400).send({ error: (err as Error).message });
  }
};

// User can Apply for Debit card
export const applyDebit = async (req, res) => {
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
    const accountUser = await User.findOne({ _id: userid });
    let fullname = (accountUser?.firstname || "") + " " + (accountUser?.lastname || "");
    let userEmail = accountUser?.email || "";

    const cardDataAdded = await DebitCard.findOne({ userid: userid });
    if (cardDataAdded?.status === "pending") {
      return res.status(402).send({
        msg: "You are Already applied for Debit card .pls Wait for Approval ",
      });
    }

    const debitCardApplication = await DebitCard.create({
      userid: userid,
      cardHolder: fullname,
    });
    
    if (debitCardApplication) {
      sendAppliedDebitCardEmail(fullname, userEmail);
      // Send admin notification
      let date = getDateIST(debitCardApplication.createdAt) + " " + getTimeIST(debitCardApplication.createdAt);
      sendAdminDebitCardApplicationNotification(fullname, userEmail, date);
    }

    res.send({ msg: "Successfully Debit Card Applied.Wait For Approval " });
  } catch (err) {
    console.error("Error:", err);
    return res.status(400).send({ error: (err as Error).message });
  }
};

// check The Debit card is Present or not
export const checkDebitCard = async (
  req,
  res
) => {
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
    const cardDataAdded = await DebitCard.findOne({ userid: userid });
    if (cardDataAdded?.status === "accepted") {
      return res.send({ success: true });
    }
    res.send({ success: false });
  } catch (err) {
    console.error("Error:", err);
    return res.status(400).send({ error: (err as Error).message });
  }
};

// Get the Debit card Details
export const getDebitCardDetails = async (
  req,
  res
) => {
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
    const debitCardData = await DebitCard.findOne({ userid: userid });

    if (!debitCardData) {
      return res.send({ msg: "First Apply for the DebitCard" });
    }

    if (
      debitCardData.status === "pending" ||
      debitCardData.status === "rejected"
    ) {
      return res.send({ msg: "Debit Card is pending or rejected" });
    }

    let debitCardDetails = debitCardData.cardNumber.split("");
    res.send({
      cardNumber: debitCardDetails,
      cardHolder: debitCardData.cardHolder,
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(400).send({ error: (err as Error).message });
  }
};

// Get my Email
export const getEmail = async (req, res) => {
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
    const getEmail = await User.findOne({ _id: userid });
    return res.send({ email: getEmail?.email });
  } catch (err) {
    console.error("Error:", err);
    return res.status(400).send({ error: (err as Error).message });
  }
};

// Get transactions by date range
export const getTransactionsByDateRange = async (
  req,
  res
) => {
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
    const { fromDate, toDate } = req.query;

    // Parse dates from query parameters
    const startDate = new Date(fromDate as string);
    const endDate = new Date(toDate as string);
    
    // Set end date to end of day
    endDate.setHours(23, 59, 59, 999);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).send({ msg: "Invalid date format. Use YYYY-MM-DD" });
    }

    // Fetch all transactions within the date range
    const creditTransactions = await Credit.find({
      accUser: userid,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    const debitTransactions = await Debit.find({
      accUser: userid,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    const transferTransactions = await Transfer.find({
      accUser: userid,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    // Combine and format all transactions
    const allTransactions = [
      ...creditTransactions.map((item) => ({
        ...item.toObject(),
        type: "Credit",
        transactionDate: item?.date ? getDateIST(item.date) : null,
        transactionTime: item?.date ? getTimeIST(item.date) : null,
      })),
      ...debitTransactions.map((item) => ({
        ...item.toObject(),
        type: "Debit",
        transactionDate: item?.date ? getDateIST(item.date) : null,
        transactionTime: item?.date ? getTimeIST(item.date) : null,
      })),
      ...transferTransactions.map((item) => ({
        ...item.toObject(),
        type: "Transfer",
        transactionDate: item?.date ? getDateIST(item.date) : null,
        transactionTime: item?.date ? getTimeIST(item.date) : null,
      })),
    ];

    // Sort by date descending
    allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (allTransactions.length === 0) {
      return res.send({
        msg: "No transactions found for the given date range",
        transactions: [],
      });
    }

    res.send(allTransactions);
  } catch (err) {
    console.error("Error:", err);
    return res.status(400).send({ error: (err as Error).message });
  }
};
