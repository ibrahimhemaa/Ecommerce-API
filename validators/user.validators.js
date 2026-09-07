import { validator } from "../middleware/validator.middleware.js";
import { check } from "express-validator";
import slugify from "slugify";
import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
export const getUserByIDValidator = [
  check("id").isMongoId().withMessage("invalid ID"),
  validator,
];

export const createUserValidator = [
  check("name")
    .isString()
    .withMessage("name must be a string ")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 5 })
    .withMessage("name must be greater than 5")
    .custom((val, { req }) => (req.body.slug = slugify(val))),

  check("email")
    .custom((val, { req }) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) return Promise.reject(" Email has already Been Taken");
      }),
    )
    .isEmail()
    .withMessage("invalid Email !"),

  check("phone")
    .isString()
    .withMessage("Phone must be a String")
    .notEmpty()
    .withMessage("Phone is required")
    .isMobilePhone(["ar-SA", "ar-EG"])
    .withMessage("invalid Phone Number"),

  check("password")
    .isString()
    .withMessage("password must be a String")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must greater than 6")
    .custom((val, { req }) => {
      if (val !== req.body.confirmPassword) {
        return Promise.reject(" Password does not Match");
      }
      return true;
    }),
  check("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword is required")
    .isString()
    .withMessage("confirmPassword must be a String"),

  check("imgProfile").optional(),

  check("role").optional(),
  validator,
];

export const updateUserValidator = [
  check("id").isMongoId().withMessage("invalid ID"),
  check("name")
    .isString()
    .withMessage("name must be a string ")
    .optional()
    .isLength({ min: 5 })
    .withMessage("name must be greater than 5")
    .custom((val, { req }) => (req.body.slug = slugify(val))),

  check("email")
    .custom((val, { req }) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) return Promise.reject(" Email has already Been Taken");
      }),
    )
    .optional()
    .isEmail()
    .withMessage("invalid Email !"),

  check("phone")
    .isString()
    .withMessage("Phone must be a String")
    .optional()
    .isMobilePhone(["ar-SA", "ar-EG"])
    .withMessage("invalid Phone Number"),

  check("imgProfile").optional(),

  check("role").optional(),
  validator,
];

export const deleteUserValidator = [
  check("id").isMongoId().withMessage("invalid ID"),
  validator,
];
export const changeUserValidator = [
  check("confirmPassword")
    .isString()
    .withMessage("confirmPassword must be a String")
    .notEmpty()
    .withMessage("confirmPassword is required"),
  check("id").isMongoId().withMessage("invalid ID"),
  check("currentPassword")
    .isString()
    .withMessage("currentPassword must be a String")
    .notEmpty()
    .withMessage("currentPassword is required"),
  check("password")
    .isString()
    .withMessage(" Password must be String")
    .notEmpty()
    .withMessage(" Password is required")
    .custom(async (val, { req }) => {
      const user = await userModel.findById(req.params.id).select("+password");
       if (!user) {
        return Promise.reject("User not Found");
      } else {
        const confirmPassword = await bcrypt.compare(req.body.currentPassword, user.password);
        if (confirmPassword) {
          return true;
        } else {
          return Promise.reject("currentPassword Does Not Match ");
        }
      }
    }),
  validator,
];
export const updateLoggedUserDataValidator  = [
  check("name")
    .isString()
    .withMessage("name must be a string ")
    .optional()
    .isLength({ min: 5 })
    .withMessage("name must be greater than 5")
    .custom((val, { req }) => (req.body.slug = slugify(val))),

  check("email")
    .custom((val, { req }) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) return Promise.reject(" Email has already Been Taken");
      }),
    )
    .optional()
    .isEmail()
    .withMessage("invalid Email !"),

  check("phone")
    .isString()
    .withMessage("Phone must be a String")
    .optional()
    .isMobilePhone(["ar-SA", "ar-EG"])
    .withMessage("invalid Phone Number"),

  check("imgProfile").optional(),

  check("role").optional(),
  validator,
];

export const updateLoggedUserPasswordValidator = [
  check("confirmPassword")
    .isString()
    .withMessage("confirmPassword must be a String")
    .notEmpty()
    .withMessage("confirmPassword is required"),
   check("currentPassword")
    .isString()
    .withMessage("currentPassword must be a String")
    .notEmpty()
    .withMessage("currentPassword is required"),
  check("password")
    .isString()
    .withMessage(" Password must be String")
    .notEmpty()
    .withMessage(" Password is required")
    .custom(async (val, { req }) => {
      const user = await userModel.findById(req.params.id).select("+password");
       if (!user) {
        return Promise.reject("User not Found");
      } else {
        const confirmPassword = await bcrypt.compare(req.body.currentPassword, user.password);
        if (confirmPassword) {
          return true;
        } else {
          return Promise.reject("currentPassword Does Not Match ");
        }
      }
    }),
  validator,
];

 


export const signupValidator = [
  check("name")
    .isString()
    .withMessage("name must be a string ")
    .notEmpty()
    .withMessage("name is required")
    .isLength({ min: 5 })
    .withMessage("name must be greater than 5")
    .custom((val, { req }) => (req.body.slug = slugify(val))),

  check("email")
    .custom((val, { req }) =>
      userModel.findOne({ email: val }).then((user) => {
        if (user) return Promise.reject(" Email has already Been Taken");
      }),
    )
    .isEmail()
    .withMessage("invalid Email !"),
 
  check("password")
    .isString()
    .withMessage("password must be a String")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must greater than 6"),
  validator,
];

export const loginValidator = [

   check("email")
    .isEmail()
    .withMessage("invalid Email !"),
 
  check("password")
    .isString()
    .withMessage("password must be a String")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must greater than 6"),
  validator,
]
 