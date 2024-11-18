const { OTP, User } = require("../schema/usersSchema");
const { hashPassword } = require("../utils/helpers");

const OTPverification = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    // Find the most recent OTP entry for the given email
    const findAccount = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

    // Check if OTP entry exists
    if (findAccount.length === 0) {
      return res.send({ msg: "This OTP has expired. Please regenerate OTP." });
    }

    const generatedOtp = findAccount[0].otp;

    // Verify the OTP
    if (Number(generatedOtp) !== Number(otp)) {
      return res.send({ msg: "OTP verification failed." });
    }

    // Check if the email is registered
    const account = await User.findOne({ email });
    if (!account) {
      return res.send({ msg: "This email is not registered." });
    }

    // Hash the new password and update the user account
    const hashedPassword = hashPassword(password);
    account.password = hashedPassword;
    await account.save();

    return res.send({ msg: "Password changed successfully." });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

module.exports = {
  OTPverification,
};
