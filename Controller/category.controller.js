import categoryModel from "../models/category.model.js";
import slugify from "slugify";
import { AppError } from "../utils/errorhandler.js";
import asyncHandler from "express-async-handler";
import { ApiFeatures } from "../utils/api.Features.js";
import multer from "multer";
import { v4 as uuid4 } from "uuid";
import sharp from "sharp";
import {
  createOne,
  deleteOne,
  updateOne,
  getByID,
  getAll,
} from "./handlerFactory.js";
import { uploadSingleImage } from "../middleware/multer.middleware.js";


export const resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `category ${uuid4()} ${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 60 })
    .toFile(`uploads/Categories/${filename}`);
  req.body.image = filename;
  next();
});

export const uploadCategories = uploadSingleImage("image");

export const createCategory = createOne(categoryModel, "Categories");

export const getCategories = getAll(categoryModel);

export const getCategoryByID = getByID(categoryModel);

export const updateCategory = updateOne(categoryModel);

export const deleteCategory = deleteOne(categoryModel);
