import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { Account, Admin, DebitCard, User } from "../schema/usersSchema";
import {
  comparePassword,
  hashPassword,
  sendDebitCardRejectEmail,
  sendDebitCardStatusEmail,
} from "../utils/helpers";
import { adminTokens } from "../utils/tokenGeneration";
import { verifyAdminToken } from "../middlewares/verifyTokens";
import { getDateIST, getTimeIST } from "../utils/getIstDateTime";

// Admin registering
export const registerAdmin = async (
  req: Request,
  res: Response
): Promise<any> => {
  const data = matchedData(req);
  const { username, password, email } = data;
  if (!username || !password || !email) {
    return res
      .status(401)
      .send({ msg: "username and password and email are required" });
  }
  try {
    const user = await Admin.findOne({ username });
    if (user) return res.status(401).send({ msg: "User already exists" });

    const hashedPassword = hashPassword(password);

    const newUser = new Admin({
      username,
      password: hashedPassword,
      email,
    });

    const savedUser = await newUser.save();
    return res.status(201).send({
      msg: `Registered Successful  ✅.Pls login ${savedUser.username}`,
    });
  } catch (err: any) {
    return res.status(400).send({ error: err });
  }
};

// Login the Admin
export const adminLogin = async (req: Request, res: Response): Promise<any> => {
  try {
    const body = req.body;
    const pass = body.password;

    const findUser = await Admin.findOne({
      $or: [{ username: body.username }, { email: body.email }],
    });

    if (!findUser) throw new Error("Admin not found");
    if (findUser.role !== 1) {
      throw new Error("Unauthorized: Admin access required");
    }
    if (!comparePassword(pass, findUser.password))
      throw new Error("Bad Credentials");
    const finalResult = findUser.toObject();
    const { accessToken } = adminTokens(findUser);
    const { password, ...admin } = finalResult;

    return res.send({
      msg: "Login Successful",
      admin,
      accessToken,
      role: findUser.role,
    });
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};

// Admin can view All users
export const viewAllUsers = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const result = await User.find({}).select("-password");
    res.send(result);
  } catch (err: any) {
    return res.status(400).send({ error: err.message });
  }
};

// Get All the Debit Card Details
export const getAllPendingDebitCards = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const debitCardData: any = await DebitCard.find({
      status: "pending",
    }).select(["-updatedAt"]);
    if (debitCardData.length === 0) {
      return res.send({ msg: "Till Now No one can Apply for Debit Cards" });
    }

    // Fetch user details for each pending debit card
    const debitCardDetailsWithUsers = await Promise.all(
      debitCardData.map(async (debitCard: any) => {
        console.log(debitCard);
        const user = await User.findById(debitCard.userid).select([
          "firstname",
          "lastname",
          "email",
        ]);
        const accountDetails: any = await Account.findOne({
          accUser: debitCard.userid,
        });
        return {
          ...debitCard.toObject(),
          email: user?.email,
          accNumber: accountDetails.accNumber,
          date: getDateIST(debitCard.createdAt),
          time: getTimeIST(debitCard.createdAt),
          accBalance: accountDetails.accBalance,
        };
      })
    );

    res.send(debitCardDetailsWithUsers);
  } catch (err: any) {
    console.error("Error:", err);
    return res.status(400).send({ error: err.message });
  }
};

const generateUniqueCardNumber = async () => {
  let cardNumber;
  let isUnique = false;

  while (!isUnique) {
    cardNumber =
      "4" +
      Math.floor(Math.random() * 1000000000)
        .toString()
        .padStart(11, "0");

    const existingCard = await DebitCard.findOne({ cardNumber });
    if (!existingCard) {
      isUnique = true;
    }
  }

  return cardNumber;
};
// Function to generate a unique CVV
const generateUniqueCVV = async () => {
  let cvv;
  let isUnique = false;

  while (!isUnique) {
    cvv = Math.floor(100 + Math.random() * 900).toString();

    const existingCard = await DebitCard.findOne({ cvv });
    if (!existingCard) {
      isUnique = true;
    }
  }

  return cvv;
};

const generateExpiryDate = async () => {
  const month = Math.floor(Math.random() * 12) + 1;
  const year = new Date().getFullYear() + Math.floor(Math.random() * 5);
  let expiryDate = `${month.toString().padStart(2, "0")}/${year}`;
  return expiryDate;
};

// Admin can approve or reject the debit card application
export const reviewDebitCardApplication = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { debitid, status } = req.body;
  try {
    const debitCardApplication: any = await DebitCard.findOne({ _id: debitid });
    if (!debitCardApplication) {
      return res.status(404).send({ msg: "Application not found" });
    }
    const debitCardAccount: any = await User.findOne({
      _id: debitCardApplication.userid,
    });
    if (debitCardApplication) {
      let name = debitCardApplication.cardHolder;
      let email = debitCardAccount?.email;
      sendDebitCardStatusEmail(name, email, status);
    }
    if (status === "accepted") {
      const cardNumber = await generateUniqueCardNumber();
      const cvv = await generateUniqueCVV();
      const expiryDate = await generateExpiryDate();
      debitCardApplication.status = status;
      debitCardApplication.cardNumber = cardNumber;
      debitCardApplication.cvv = cvv;
      debitCardApplication.expiryDate = expiryDate;
      const savedCard = await debitCardApplication.save();
      console.log(savedCard, " savedcard ");

      return res.send({ msg: "Debit Card Approved", debitCardApplication });
    } else if (status === "rejected") {
      debitCardApplication.status = status;
      const rejectedStatus = await debitCardApplication.save();
      if (rejectedStatus) {
        let name = debitCardApplication.cardHolder;
        let email = debitCardAccount?.email;
        sendDebitCardRejectEmail(name, email, status);
      }
      return res.send({ msg: "Debit Card Rejected", debitCardApplication });
    } else {
      return res.status(400).send({ msg: "Invalid action" });
    }
  } catch (err: any) {
    console.error("Error:", err);
    return res.status(400).send({ error: err.message });
  }
};
