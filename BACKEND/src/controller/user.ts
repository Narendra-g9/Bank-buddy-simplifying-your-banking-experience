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
} from "../utils/helpers";
import { userTokens } from "../utils/tokenGeneration";
import { verifyUserToken } from "../middlewares/verifyTokens";
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
  req: Request,
  res: Response
): Promise<any> => {
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
  } catch (err: any) {
    return res.status(400).send({ error: err });
  }
};
// Login the User
export const userLogin = async (req: Request, res: Response): Promise<any> => {
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
  } catch (err: any) {
    console.log(err);
    return res.status(400).send({ error: err.message });
  }
};

// Credit the Amount
export const creditAmount = async (
  req: Request,
  res: Response
): Promise<any> => {
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
    const getAccount: any = await Account.findOne({ accUser: userid });
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
      let userFullName = userDetails?.firstname + " " + userDetails?.lastname;
      let useremail: any = userDetails?.email;
      let dateTime = date + " " + time;
      let balance = savedAccount?.accBalance;
      let accountnumberis = savedAccount?.accUser;
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
    }
    return res.send({ msg: "Credited Amount Successfully", savedAccount });
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};

// Credit the Amount
export const debitAmount = async (
  req: Request,
  res: Response
): Promise<any> => {
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
    const getAccount: any = await Account.findOne({ accUser: userid });
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
      let userFullName = userDetails?.firstname + " " + userDetails?.lastname;
      let useremail: any = userDetails?.email;
      let dateTime = date + " " + time;
      let balance = savedAccount?.accBalance;
      let accountnumberis = savedAccount?.accUser;
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
    }
    return res.send({ msg: "Debited Amount Successfully", savedAccount });
  } catch (err: any) {
    console.log(err);
    return res.status(400).send({ error: err.message });
  }
};

// Transfer the Amount
export const transferAmount = async (
  req: Request,
  res: Response
): Promise<any> => {
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
    const getsourceAccount: any = await Account.findOne({
      accUser: userid,
    });
    if (amount > getsourceAccount.accBalance) {
      return res.send({
        msg: `Your account balance is insufficient to transfer`,
      });
    }
    getsourceAccount.accBalance -= amount;
    const savedAccount = await getsourceAccount.save();
    const getdestinationAccount: any = await Account.findOne({
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
      let userFullName = userDetails?.firstname + " " + userDetails?.lastname;
      let useremail: any = userDetails?.email;
      let dateTime = date + " " + time;
      let balance = savedAccount?.accBalance;
      let accountnumberis = savedAccount?.accUser;
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
    }

    res.send({
      msg: `Amount transfered from ${getsourceAccount.accNumber} to ${destinationAccount} Successful`,
    });
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};

// Helper function to get only the date in IST
const getDateIST = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return new Date(date).toLocaleDateString("en-IN", options);
};

// Helper function to get only the time in IST
const getTimeIST = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return new Date(date).toLocaleTimeString("en-IN", options);
};

// Get all credit transactions based on accountId
export const getAllCreditTransactions = async (
  req: Request,
  res: Response
): Promise<any> => {
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
    const finalResult = result.map((eachItem: any) => {
      return {
        ...eachItem.toObject(),
        transactionDate: eachItem?.date ? getDateIST(eachItem.date) : null,
        transactionTime: eachItem?.date ? getTimeIST(eachItem.date) : null,
      };
    });

    res.send(finalResult);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};
// Get all Debit transactions based on accountId
export const getAllDebitTransactions = async (
  req: Request,
  res: Response
): Promise<any> => {
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
    const finalResult = result.map((eachItem: any) => {
      return {
        ...eachItem.toObject(),
        transactionDate: eachItem?.date ? getDateIST(eachItem.date) : null,
        transactionTime: eachItem?.date ? getTimeIST(eachItem.date) : null,
      };
    });

    res.send(finalResult);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};
// Get all Transfer transactions based on accountId
export const getAllTransferTransactions = async (
  req: Request,
  res: Response
): Promise<any> => {
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
    const finalResult = result.map((eachItem: any) => {
      return {
        ...eachItem.toObject(),
        transactionDate: eachItem?.date ? getDateIST(eachItem.date) : null,
        transactionTime: eachItem?.date ? getTimeIST(eachItem.date) : null,
      };
    });

    res.send(finalResult);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};

// Get the profile History and Balance
export const getProfileWithAccount = async (
  req: Request,
  res: Response
): Promise<any> => {
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
  } catch (err: any) {
    console.error("Error:", err);
    return res.status(400).send({ error: err.message });
  }
};

// Get account details based on Account Number
export const getAccount = async (req: Request, res: Response): Promise<any> => {
  const accountid = req.params.accountnumber;
  try {
    const result: any = await Account.findOne({ accNumber: accountid }).select(
      "accHolder"
    );
    const { accHolder } = result;
    return res.send(accHolder);
  } catch (err: any) {
    console.error("Error:", err);
    return res.status(400).send({ error: err.message });
  }
};

// Define a type for the filter
interface TransactionFilter {
  accUser: String;
  date?: {
    $gte: Date;
    $lte: Date;
  };
}

// Get transactions by date range
export const getTransactionsByDateRange = async (
  req: Request,
  res: Response
): Promise<any> => {
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
    const { startDate, endDate } = req.query;

    // Base filter
    let filter: TransactionFilter = { accUser: userid };

    // If dates are provided, add date filter
    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);
      filter = {
        ...filter,
        date: { $gte: start, $lte: end },
      };
    }

    // Fetch transactions
    const creditTransactions = await Credit.find(filter).sort({ date: -1 });
    const debitTransactions = await Debit.find(filter).sort({ date: -1 });
    const transferTransactions = await Transfer.find(filter).sort({ date: -1 });

    // Combine results and add transaction type
    const combinedTransactions = [
      ...creditTransactions.map((tx) => ({
        ...tx.toObject(),
        type: "credit",
        destinationAccount: "",
        username: "",
        transactionDate: getDateIST(tx.date),
        transactionTime: getTimeIST(tx.date),
      })),
      ...debitTransactions.map((tx) => ({
        ...tx.toObject(),
        type: "debit",
        destinationAccount: "",
        username: "",
        transactionDate: getDateIST(tx.date),
        transactionTime: getTimeIST(tx.date),
      })),
      ...(await Promise.all(
        transferTransactions.map(async (tx) => {
          const destinationAccountUser = await User.findOne({
            _id: tx.destUser,
          });
          const destinationUserName = destinationAccountUser
            ? `${destinationAccountUser.firstname} ${destinationAccountUser.lastname}`
            : "Unknown";

          return {
            ...tx.toObject(),
            type: "transfer",
            username: destinationUserName,
            transactionDate: getDateIST(tx.date),
            transactionTime: getTimeIST(tx.date),
          };
        })
      )),
    ];

    const accountDetails = await Account.findOne({ accUser: userid });
    let accountBalance = accountDetails?.accBalance;
    if (combinedTransactions.length === 0) {
      return res.send({ combinedTransactions, accountBalance: accountBalance });
    }

    res.send({ combinedTransactions, accountBalance: accountBalance });
  } catch (err: any) {
    console.error("Error:", err);
    return res.status(400).send({ error: err.message });
  }
};

// User can Apply for Debit card
export const applyDebit = async (req: Request, res: Response): Promise<any> => {
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
    let fullname = accountUser?.firstname + " " + accountUser?.lastname;
    let userEmail = accountUser?.email!;

    const cardDataAdded: any = await DebitCard.findOne({ userid: userid });
    if (cardDataAdded?.status === "pending") {
      return res.status(402).send({
        msg: "You are Already applied for Debit card .pls Wait for Approval ",
      });
    }

    await DebitCard.create({
      userid: userid,
      cardHolder: fullname,
    });
    if (true) {
      sendAppliedDebitCardEmail(fullname, userEmail);
    }

    res.send({ msg: "Successfully Debit Card Applied.Wait For Approval " });
  } catch (err: any) {
    console.error("Error:", err);
    return res.status(400).send({ error: err.message });
  }
};

// check The Debit card is Present or not
export const checkDebitCard = async (
  req: Request,
  res: Response
): Promise<any> => {
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
  } catch (err: any) {
    console.error("Error:", err);
    return res.status(400).send({ error: err.message });
  }
};

// Get the Debit card Details
export const getDebitCardDetails = async (
  req: Request,
  res: Response
): Promise<any> => {
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
    const debitCardData: any = await DebitCard.findOne({ userid: userid });

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
  } catch (err: any) {
    console.error("Error:", err);
    return res.status(400).send({ error: err.message });
  }
};

// Get my Email
export const getEmail = async (req: Request, res: Response): Promise<any> => {
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
  } catch (err: any) {
    console.error("Error:", err);
    return res.status(400).send({ error: err.message });
  }
};
