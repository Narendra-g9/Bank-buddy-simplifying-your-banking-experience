const { matchedData } = require("express-validator");
const { Account, Admin, DebitCard, User } = require("../schema/usersSchema");
const {
  comparePassword,
  hashPassword,
  sendDebitCardRejectEmail,
  sendDebitCardStatusEmail,
} = require("../utils/helpers");
const { adminTokens } = require("../utils/tokenGeneration");
const { getDateIST, getTimeIST } = require("../utils/getIstDateTime");

// Admin registering
const registerAdmin = async (req, res) => {
  const data = matchedData(req);
  const { username, password, email } = data;
  if (!username || !password || !email) {
    return res
      .status(401)
      .send({ msg: "Username, password, and email are required" });
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
      msg: `Registered Successfully ✅. Please login, ${savedUser.username}`,
    });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

// Admin login
const adminLogin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const findUser = await Admin.findOne({
      $or: [{ username }, { email }],
    });

    if (!findUser) throw new Error("Admin not found");
    if (findUser.role !== 1) {
      throw new Error("Unauthorized: Admin access required");
    }
    if (!comparePassword(password, findUser.password))
      throw new Error("Bad Credentials");

    const { accessToken } = adminTokens(findUser);
    const { password: _, ...admin } = findUser.toObject();

    return res.send({
      msg: "Login Successful",
      admin,
      accessToken,
      role: findUser.role,
    });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

// View all users
const viewAllUsers = async (req, res) => {
  try {
    const result = await User.find({}).select("-password");
    res.send(result);
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

// Get all pending debit card applications
const getAllPendingDebitCards = async (req, res) => {
  try {
    const debitCardData = await DebitCard.find({ status: "pending" }).select(["-updatedAt"]);
    if (debitCardData.length === 0) {
      return res.send({ msg: "No pending debit card applications" });
    }

    const debitCardDetailsWithUsers = await Promise.all(
      debitCardData.map(async (debitCard) => {
        const user = await User.findById(debitCard.userid).select([
          "firstname",
          "lastname",
          "email",
        ]);
        const accountDetails = await Account.findOne({
          accUser: debitCard.userid,
        });
        return {
          ...debitCard.toObject(),
          email: user?.email,
          accNumber: accountDetails?.accNumber,
          date: getDateIST(debitCard.createdAt),
          time: getTimeIST(debitCard.createdAt),
          accBalance: accountDetails?.accBalance,
        };
      })
    );

    res.send(debitCardDetailsWithUsers);
  } catch (err) {
    console.error("Error:", err);
    return res.status(400).send({ error: err.message });
  }
};

// Generate unique card number
const generateUniqueCardNumber = async () => {
  let cardNumber;
  let isUnique = false;

  while (!isUnique) {
    cardNumber = "4" + Math.floor(Math.random() * 1000000000).toString().padStart(11, "0");
    const existingCard = await DebitCard.findOne({ cardNumber });
    if (!existingCard) {
      isUnique = true;
    }
  }

  return cardNumber;
};

// Generate unique CVV
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

// Generate expiry date
const generateExpiryDate = () => {
  const month = Math.floor(Math.random() * 12) + 1;
  const year = new Date().getFullYear() + Math.floor(Math.random() * 5);
  return `${month.toString().padStart(2, "0")}/${year}`;
};

// Review debit card application
const reviewDebitCardApplication = async (req, res) => {
  const { debitid, status } = req.body;
  try {
    const debitCardApplication = await DebitCard.findById(debitid);
    if (!debitCardApplication) {
      return res.status(404).send({ msg: "Application not found" });
    }
    const user = await User.findById(debitCardApplication.userid);
    const email = user?.email;
    const name = debitCardApplication.cardHolder;

    if (status === "accepted") {
      const cardNumber = await generateUniqueCardNumber();
      const cvv = await generateUniqueCVV();
      const expiryDate = generateExpiryDate();

      debitCardApplication.status = status;
      debitCardApplication.cardNumber = cardNumber;
      debitCardApplication.cvv = cvv;
      debitCardApplication.expiryDate = expiryDate;

      await debitCardApplication.save();
      sendDebitCardStatusEmail(name, email, status);

      return res.send({ msg: "Debit Card Approved", debitCardApplication });
    } else if (status === "rejected") {
      debitCardApplication.status = status;
      await debitCardApplication.save();
      sendDebitCardRejectEmail(name, email, status);

      return res.send({ msg: "Debit Card Rejected", debitCardApplication });
    } else {
      return res.status(400).send({ msg: "Invalid action" });
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(400).send({ error: err.message });
  }
};

module.exports = {
  registerAdmin,
  adminLogin,
  viewAllUsers,
  getAllPendingDebitCards,
  reviewDebitCardApplication,
};
