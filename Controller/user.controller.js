import userModel from "../models/user.model.js";
import asyncHandler from "express-async-handler";
import sharp from "sharp";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/errorhandler.js";
import { v4 as uuid4 } from "uuid";
import { uploadSingleImage } from "../middleware/multer.middleware.js";

import {
  createOne,
  deleteOne,
  getAll,
  getByID,
  updateOne,
} from "./handlerFactory.js";

export const resizeUserImage = asyncHandler(async (req, res, next) => {
  const filename = `user ${uuid4()} ${Date.now()}.jpeg`;
  if (req.file && req.file.buffer) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 60 })
      .toFile(`uploads/Users/${filename}`);
    req.body.imgProfile = filename;
  }

  next();
});

export const uploadUserImages = uploadSingleImage("imgProfile");

export const createUser = createOne(userModel);

export const getUsers = getAll(userModel, "Users");

export const getUserByID = getByID(userModel);

export const updateUser = updateOne(userModel);

export const deleteUser = deleteOne(userModel);

export const changePassword = asyncHandler(async (req, res, next) => {
  const document = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12),
      changePasswordAt: Date.now(),
    },
    { returnDocument: "after" },
  );
  if (!document) return next(new AppError(404, `${req.params.id} Not Found `));
  res.status(201).json({ message: ` changed Successfully`, data: document });
});

export const getLoggedUser = (req, res, next) => {
  req.params.id = req.userid;
  next();
};

export const updatePasswordLoggedUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.userid,
    {
      password: await bcrypt.hash(req.body.password, 12),
      changePasswordAt: Date.now(),
    },
    { returnDocument: "after" },
  );
  if (!user) return next(new AppError(404, `${req.userid} Not Found `));

  const token = jwt.sign(
    { userID: user._id, role: user.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JET_EXPIRED_TIME },
  );
  res
    .status(201)
    .json({ message: ` Password Changed Successfully`, data: user, token });
});
export const updateDataLoggedUser = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.userid,
    {
      ...req.body,
    },
    { returnDocument: "after" },
  );
  if (!user) return next(new AppError(404, `${req.userid} Not Found `));

  res
    .status(201)
    .json({ message: `Data Changed Successfully`, data: user, token });
});

export const deleteUserData = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.userid,
    {
      isActive: false,
    },
    { returnDocument: "after" },
  );
  if (!user) return next(new AppError(404, `${req.userid} Not Found `));

  res.status(201).json({ message: `Data Deleted Successfully` });
});
