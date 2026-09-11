import { validator } from "../middleware/validator.middleware.js";
import { check } from "express-validator";
import slugify from "slugify";
export const getCategoryByIDValidator = [
  check("id").isMongoId().withMessage("invalid ID"),
  validator,
];
export const createCategoryValidator = [
  check("name")
    .isString()
    .withMessage("name must be a string ")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("name must be greater than 8")
    .custom((val, { req }) => (req.body.slug = slugify(val))),
  validator,
];

export const updateCategoryValidator = [
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

export const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("invalid ID"),
  validator,
];
