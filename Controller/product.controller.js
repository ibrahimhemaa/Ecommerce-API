import productModel from "../models/product.model.js";
import slugify from "slugify";
import { AppError } from "../utils/errorhandler.js";
import asyncHandler from "express-async-handler";
import qs from "qs";
import { ApiFeatures } from "../utils/api.Features.js";
import multer from "multer";
import { v4 as uuid4 } from "uuid";
import sharp from "sharp";
import {
  createOne,
  deleteOne,
  getAll,
  getByID,
  updateOne,
} from "./handlerFactory.js";

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError(402, "only allowed images"), false);
  }
};
const uploads = multer({ storage: multerStorage, fileFilter: multerFilter });

export const uploadProductImages = uploads.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]);
export const resizeProductImage = asyncHandler(async (req, res, next) => {
  const filename = `product ${uuid4()} ${Date.now()}cover.jpeg`;
  console.log(req.file);
  if (req.files && req.files.imageCover) {
    await sharp(req.files.imageCover[0].buffer)
      .resize(1200, 800)
      .toFormat("jpeg")
      .jpeg({ quality: 60 })
      .toFile(`uploads/Products/${filename}`);
    req.body.imageCover = filename;
  }

  if (req.files && req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map((img, index) => {
        console.log(img);
        const filename = `product ${uuid4()} ${Date.now()}${index + 1}.jpeg`;
        sharp(img.buffer)
          .resize(1200, 800)
          .toFormat("jpeg")
          .jpeg({ quality: 60 })
          .toFile(`uploads/Products/${filename}`);
        req.body.images.push(filename);
      }),
    );
  }
  next();
});
// const populateOptions = { path: "reviews", select: "ratings title  -_id" };
export const createProduct = createOne(productModel);

export const getProducts = getAll(productModel, 'Products')

export const getProductByID = getByID(productModel , 'reviews');

export const updateProduct = updateOne(productModel);

export const deleteProduct = deleteOne(productModel);
