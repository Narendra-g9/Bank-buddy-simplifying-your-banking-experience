import { Request, Response } from "express";
import otpGenerator from "otp-generator";
import { OTP, Admin } from "../schema/usersSchema";
import nodemailer from "nodemailer";
import config from "../config";

export const sendAdminOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const findAdmin = await Admin.findOne({ email: email });
    if (!findAdmin) {
      return res
        .status(402)
        .send({ msg: "Email didn't exist. Please register as admin first" });
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
      // Send OTP Email
      const transporter = nodemailer.createTransport(config.SMTP_URL, {});
      const mailOptions = {
        from: process.env.MAIL_FROM || "no-reply@yourapp.com",
        to: email,
        subject: `Admin Password Reset OTP`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="background-color: white; padding: 20px; border-radius: 8px;">
              <h2 style="color: #333;">Admin Password Reset</h2>
              <p>Your OTP for password reset is:</p>
              <h1 style="color: #27ae60; text-align: center;">${otp}</h1>
              <p>This OTP is valid for 10 minutes only.</p>
              <p style="color: #666; margin-top: 20px;">If you did not request this, please ignore this email.</p>
            </div>
          </div>
        `,
      };
      await transporter.sendMail(mailOptions);
    }
    res.status(200).json({
      message: "OTP sent successfully to your email",
    });
  } catch (err) {
    return res.status(400).send({ error: (err as Error).message });
  }
};

export const verifyAdminOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(401).send({
        msg: "Email, OTP, and new password are required",
      });
    }

    // Verify OTP from database
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(401).send({
        msg: "Invalid OTP",
      });
    }

    // Find admin and update password
    const bcrypt = require("bcrypt");
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(newPassword, saltRounds);

    const admin = await Admin.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!admin) {
      return res.status(404).send({
        msg: "Admin not found",
      });
    }

    // Delete used OTP
    await OTP.deleteOne({ email, otp });

    return res.status(200).send({
      msg: "Password updated successfully. Please login with your new password",
      success: true,
    });
  } catch (err) {
    return res.status(400).send({ error: (err as Error).message });
  }
};
