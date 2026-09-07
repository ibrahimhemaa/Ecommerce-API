import { AppError } from "../utils/errorhandler.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";
export const signup = asyncHandler(async (req, res, next) => {
  const user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const token = jwt.sign(
    { userID: user._id  , role:user.role},
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JET_EXPIRED_TIME },
  );
  user.password = undefined;
  res.status(201).json({ message: "register Successfully", user, token });
});

export const login = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email }).select("+password");
  console.log(user);
  if (!user)
    return res.status(401).json({ message: "invalid Email or Password" });
  const confirmPassword = await bcrypt.compare(
    req.body.password,
    user.password,
  );
  if (!confirmPassword) {
    return next(new AppError (401 , 'invalid Email or Password" '))
  }
  const token = jwt.sign(
    { userID: user._id ,  role:user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JET_EXPIRED_TIME },
  );
  user.password = undefined;

  return res.status(200).json({ message: "Login Successfully", user, token });
});

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) return next(new AppError(404, "User not Found"));

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashResetPassword = crypto
    .createHash("sha256")
    .update(resetCode)
    .digest("hex");
  user.resetCode = hashResetPassword;
  user.resetCodeExpired = Date.now() + 10 * 1000 * 60;
  user.resetCodeVerified = false;
  await user.save();
  try {
    await sendEmail({
      email: user.email,
      subject: `Reset Code expires after ${user.resetCodeExpired}`,
      message: `Hallo From ${process.env.SMTP_USER} resetCode ${resetCode}`,
    });
  } catch (err) {
    user.resetCode = undefined;
    user.resetCodeExpired = undefined;
    user.resetCodeVerified = undefined;
    await user.save();

    return next(new AppError(500, err.message));
  }
  res
    .status(200)
    .json({ status: "Success", message: "reset code send successfully" });
});

export const verifyResetCode = asyncHandler(async (req, res, next) => {
  const hashResetPassword = crypto
    .createHash("sha256")
    .update(req.body.resetCode)
    .digest("hex");
  const user = await userModel.findOne({
    resetCode: hashResetPassword,
    resetCodeExpired: { $gt: Date.now() },
  });
  if (!user)
    return next(new AppError(404, "invalid user or reset code expired"));
  user.resetCodeVerified = true;
  await user.save();
  res.status(200).json({ message: "Success" });
});


export const resetPassword = asyncHandler(async (req, res, next) => {
   const user = await userModel.findOne({ email: req.body.email });
  if (!user) return next(new AppError(3404, "User not Found"));

  if(!user.resetCodeVerified) return next(new AppError(404, "resetCode not verified"));

  user.password = req.body.password; 
  user.resetCode = undefined ; 
  user.resetCodeExpired = undefined
  user.resetCodeVerified = false ; 
  await user.save() ; 

  res.status(200).json({message: 'Password reset Successfully'})
});

