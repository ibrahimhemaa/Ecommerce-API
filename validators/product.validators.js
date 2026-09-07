import { validator } from "../middleware/validator.middleware.js";
import { check } from "express-validator";
import categoryModel from "../models/category.model.js";
import subCategoryModel from "../models/subCategory.model.js";
import mongoose from "mongoose";
import slugify from 'slugify'
export const getProductByIDValidator = [
  check("id").isMongoId().withMessage("invalid ID"),
  validator,
];
export const createProductValidator = [
  check("title")
    .isString()
    .withMessage("Title must be a string ")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be greater than 8")
    .isLength({ max: 32 })
    .withMessage("Title must be less than 32"),
  check("description")
    .isString()
    .withMessage("Description must be a String")
    .isLength({ min: 10 })
    .withMessage("description should be more than 10 char")
    .isLength({ max: 30 })
    .withMessage("description should be less than 30"),
  check("quantity")
    .notEmpty()
    .withMessage("quantity should not be Empty")
    .isNumeric()
    .withMessage("quantity should be a number"),
  check("sold").isNumeric().withMessage("Sold should be a Number").optional(),
  check("price")
    .notEmpty()
    .withMessage("Price Should not be Empty")
    .isNumeric()
    .withMessage("Price should be a Number")
    .toFloat(),
  check("priceAfterDiscount")
    .notEmpty()
    .withMessage("Discount Should not be Empty")
    .isNumeric()
    .withMessage("Discount should be a Number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("Discount should be less than price");
      }
      return true;
    }),

  check("color")
    .optional({ values: "falsy" })
    .isArray()
    .withMessage("color should be an array"),
   check("category")
    .notEmpty()
    .withMessage("Category is required")
    .isMongoId()
    .withMessage("Invalid Mongo ID")
    .custom((category) =>
      categoryModel.findById(category).then((category) => {
        if (!category) return Promise.reject("Category not Found ");
      }),
    ),

  check("subCategories")
    .optional({ values: "falsy" })
    .isArray()
    .withMessage("subCategories should be an Array")
    .custom((subCategories) =>
      subCategories.every((id) => mongoose.isValidObjectId(id)),
    )
    .withMessage("Invalid Mongo ID")
    .custom((subCategories) =>
      subCategoryModel.find({ _id: { $in: subCategories } }).then((result) => {
        if (result.length < 1 || result.length < subCategories.length)
          return Promise.reject("subCategory not Found ");
      }),
    )
    .custom((value, { req }) =>
      subCategoryModel.find({ category: req.body.category }).then((result) => {
        const subCategoriesIDS = [];
        result.forEach((element) => {
          subCategoriesIDS.push(element._id.toString());
        });
        if (!value.every((v) => subCategoriesIDS.includes(v))) {
          return Promise.reject(" misMatch subCategory not Found ");
        }
      }),
    ),

  check("brand")
    .isMongoId()
    .withMessage("Invalid Mongo ID")
    .notEmpty()
    .withMessage("brand is required"),
  check("ratingsAverage")
    .isNumeric()
    .withMessage("ratingsAverage should be a Number")
    .optional()
    .isLength({ min: 3 })
    .withMessage("ratingsAverage should be more than 10 char")
    .isLength({ max: 30 })
    .withMessage("ratingsAverage should be less than 10 char"),
  check("ratingQuantity")
    .isNumeric()
    .optional()
    .withMessage("ratingQuantity should be a Number"),
  validator,
];

export const updateProductValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid ID")
    .notEmpty()
    .withMessage("Invalid ID Format"),
  check("title").custom((val, { req }) => (req.body.slug = slugify(val))),
  validator,
];

export const deleteProductValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid ID")
    .notEmpty()
    .withMessage("id is required"),
  validator,
];
