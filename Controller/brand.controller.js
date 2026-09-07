import brandModel from "../models/brand.model.js";
import slugify from "slugify";
import { AppError } from "../utils/errorhandler.js";
import asyncHandler from "express-async-handler";
import { ApiFeatures } from "../utils/api.Features.js";
import { v4 as uuid4 } from "uuid";
import sharp from "sharp";
import {
  createOne,
  deleteOne,
  getAll,
  getByID,
  updateOne,
} from "./handlerFactory.js";

import { uploadSingleImage } from "../middleware/multer.middleware.js";


export const resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `brand ${uuid4()} ${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 60 })
    .toFile(`uploads/Brands/${filename}`);
    req.body.image = filename;
  next();
})
export const uploadBrandImages = uploadSingleImage('image')
export const createBrand = createOne(brandModel);

export const getBrands = getAll(brandModel , 'Brands');

export const getBrandByID = getByID(brandModel);

export const updateBrand = updateOne(brandModel);

export const deleteBrand = deleteOne(brandModel);
