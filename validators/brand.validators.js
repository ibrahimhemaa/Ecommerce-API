import { validator } from "../middleware/validator.middleware.js";
import { check } from "express-validator";
import slugify from "slugify";

export const getBrandByIDValidator = [
  check("id").isMongoId().withMessage("invalid ID"),
  validator,
];
export const getBrandsValidator = [
  check("page").optional().isInt().withMessage("page must be a number"),
  check("limit").optional().isInt().withMessage("limit must be a number"),
  validator,
];
export const createBrandValidator = [
  check("name")
    .isString()
    .withMessage("name must be a string ")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("name must be greater than 3")
  .custom((val, { req }) => (req.body.slug = slugify(val))),
  validator,
];

export const updateBrandValidator = [
  check("id").isMongoId().withMessage("invalid ID"),
  check("name")
    .isString()
    .withMessage("name must be a string ")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 8 })
    .withMessage("name must be greater than 8")
    .custom((val, { req }) => (req.body.slug = slugify(val))),
];

export const deleteBrandValidator = [
  check("id").isMongoId().withMessage("invalid ID"),
  validator,
];
