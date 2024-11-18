const otpGenerator = require("otp-generator");
const { OTP, User } = require("../schema/usersSchema");
const { sendOTPEmail } = require("../utils/helpers");

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the User collection
    const findAccount = await User.findOne({ email });
    if (!findAccount) {
      return res.status(402).send({ msg: "Email does not exist, please register" });
    }

    // Generate a 6-digit OTP without alphabets or special characters
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Ensure the OTP is unique in the OTP collection
    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp });
    }

    // Create the OTP record in the database
    const otpPayload = { email, otp };
    const otpCreate = await OTP.create(otpPayload);

    // Send the OTP email if the record is created
    if (otpCreate) {
      sendOTPEmail(email, otp);
    }

    // Respond with success message
    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(400).send({ error: err.message });
  }
};

module.exports = {
  sendOTP,
};
