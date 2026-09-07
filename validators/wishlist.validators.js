import { validator } from "../middleware/validator.middleware.js";
import { check } from "express-validator";
import productModel from "../models/product.model.js";

export const addToWishlistValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid product ID")
    .custom((val) => {
      return productModel.findById(val).then((product) => {
        if (!product) return Promise.reject(new Error("Product not found"));
      });
    }),
  validator,
];

export const removeFromWishlistValidator = [
  check("productId").isMongoId().withMessage("Invalid product ID"),
  validator,
];
