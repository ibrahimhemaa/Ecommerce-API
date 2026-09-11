import { validator } from "../middleware/validator.middleware.js";
import { check } from "express-validator";
import productModel from "../models/product.model.js";
import mongoose from "mongoose";

export const addToCartValidator = [
  check("productId")
    .isMongoId()
    .withMessage("Invalid product ID")
    .custom((val) => {
      return productModel.findById(val).then((product) => {
        if (!product) return Promise.reject(new Error("Product not found"));
      });
    }),
  check("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  check("color").optional().isString().withMessage("Color must be a string"),
  validator,
];

export const updateCartItemValidator = [
  check("itemId").isMongoId().withMessage("Invalid item ID"),
  check("quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  validator,
];

export const removeCartItemValidator = [
  check("itemId").isMongoId().withMessage("Invalid item ID"),
  validator,
];
