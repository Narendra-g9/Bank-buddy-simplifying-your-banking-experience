import { Request, Response } from "express";
import otpGenerator from "otp-generator";
import { OTP, User } from "../schema/usersSchema";
import { sendOTPEmail } from "../utils/helpers";
export const sendOTP = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email } = req.body;
    const findAccount = await User.findOne({ email: email });
    if (!findAccount) {
      return res.status(402).send({ msg: "email didn't Exist pls register" });
    }
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    const otpPayload = { email, otp };
    const otpCreate = await OTP.create(otpPayload);
    if (otpCreate) {
      sendOTPEmail(email, otp);
    }
    res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (err: any) {
    return res.status(400).send({ error: err });
  }
};
