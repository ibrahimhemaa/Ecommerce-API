import { validator } from "../middleware/validator.middleware.js";
import { check } from "express-validator";
import categoryModel from "../models/category.model.js";
import slugify from "slugify";
export const createSubCategoryValidator = [
  check("name")
    .isString()
    .withMessage("name must be a string")
    .notEmpty()
    .withMessage("name must be provided")
    .isLength({ min: 3 })
    .withMessage("name must be over 3 char")
    .isLength({ max: 32 })
    .withMessage("name must be less than than 32")
    .custom((val, { req }) => (req.body.slug = slugify(val))),
  check("category").isMongoId().withMessage("Invalid category id format").custom((category) =>
    categoryModel.findById(category).then((result) => {
      console.log(result);
      if (!result) return Promise.reject("category not Found ");
    }),
  ),
  validator,
];
export const getSubCategoriesValidator = [
  check("page").optional().isInt().withMessage("page must be a number"),
  check("limit").optional().isInt().withMessage("limit must be a number"),
  validator,
];

export const getSubCategoryByIDValidator = [
  check("id").isMongoId().withMessage("invalid Mongo ID"),
  validator,
];

export const updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid ID"),
  check("name")
    .isString()
    .withMessage("name must be a string ")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 3 })
    .withMessage("name must be greater than 8"),
  validator,
];

export const deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid ID"),
  validator,
];
