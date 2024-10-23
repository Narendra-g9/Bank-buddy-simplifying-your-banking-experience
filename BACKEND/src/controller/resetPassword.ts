import { Request, Response } from "express";
import { OTP, User } from "../schema/usersSchema";
import { hashPassword } from "../utils/helpers";

export const OTPverification = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, otp, password } = req.body;
  try {
    const findAccount = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    if (findAccount.length === 0) {
      return res.send({ msg: "This OTP expires pls regenerate OTP" });
    }
    const generatedOtp = findAccount[0].otp;
    if (Number(generatedOtp) !== Number(otp)) {
      return res.send({ msg: "Otp Verification failed" });
    }
    const account = await User.findOne({ email: email });
    if (!account) {
      return res.send({ msg: "This email Not registered" });
    }
    const hashedPassword = hashPassword(password);
    account.password = hashedPassword;
    await account.save();
    return res.send({ msg: "Password Changed Successfully" });
  } catch (err: any) {
    return res.status(400).send({ error: err });
  }
};
