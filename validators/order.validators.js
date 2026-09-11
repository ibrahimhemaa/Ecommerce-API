import { validator } from "../middleware/validator.middleware.js";
import { check } from "express-validator";

export const createCashOrderValidator = [
  check("shippingAddress.details")
    .notEmpty()
    .withMessage("Shipping address details are required")
    .isString()
    .withMessage("Details must be a string"),
  check("shippingAddress.phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isString()
    .withMessage("Phone must be a string"),
  check("shippingAddress.city")
    .notEmpty()
    .withMessage("City is required")
    .isString()
    .withMessage("City must be a string"),
  check("shippingAddress.postalCode").optional().isString(),
  validator,
];

export const getOrderValidator = [
  check("id").isMongoId().withMessage("Invalid order ID"),
  validator,
];
