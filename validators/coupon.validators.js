import { validator } from "../middleware/validator.middleware.js";
import { check } from "express-validator";
import couponModel from "../models/coupon.model.js";

export const createCouponValidator = [
  check("name")
    .notEmpty()
    .withMessage("Coupon name is required")
    .isString()
    .withMessage("Coupon name must be a string"),
  check("discount")
    .isFloat({ min: 1, max: 100 })
    .withMessage("Discount must be between 1 and 100"),
  check("expire")
    .isISO8601()
    .withMessage("Expiry date must be a valid date"),
  validator,
];

export const updateCouponValidator = [
  check("id").isMongoId().withMessage("Invalid coupon ID"),
  check("name").optional().isString().withMessage("Coupon name must be a string"),
  check("discount")
    .optional()
    .isFloat({ min: 1, max: 100 })
    .withMessage("Discount must be between 1 and 100"),
  check("expire")
    .optional()
    .isISO8601()
    .withMessage("Expiry date must be a valid date"),
  validator,
];

export const getCouponByIDValidator = [
  check("id").isMongoId().withMessage("Invalid coupon ID"),
  validator,
];

export const deleteCouponValidator = [
  check("id").isMongoId().withMessage("Invalid coupon ID"),
  validator,
];
