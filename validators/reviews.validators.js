import { validator } from "../middleware/validator.middleware.js";
import { check } from "express-validator";
import ReviewModel from "../models/reviews.model.js";
import productModel from "../models/product.model.js";
import mongoose from "mongoose";
import UserModel from "../models/user.model.js";

export const getReviewByIDValidator = [
  check("id").isMongoId().withMessage("invalid ID"),
  validator,
];
 
export const createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("ratings value required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value must be between 1 to 5"),
  check("user")
    .isMongoId()
    .withMessage("Invalid user id format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid product id format").custom((val, { req }) => {
      return productModel.findById(val).then((product) => {
        if (!product) {
          return Promise.reject(new Error("Product not found"));
        }
      });
    })
    .custom((val, { req }) => {
      return ReviewModel.findOne({ user: req.userid, product: val }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("You already created a review before"),
            );
          }
        },
      );
    }),
  validator,
];

export const updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid ID")
    .custom((val, { req }) => {
      return ReviewModel.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error("Review id not found"));
        }
        if (review.user._id.toString() !== req.userid) {
          return Promise.reject(
            new Error("You are not allowed to update this review"),
          );
        }
      });
    }),

  validator,
];

export const deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("invalid ID")
    .custom((val, { req }) => {
      if (req.role === "user") {
        return ReviewModel.findById(val).then((review) => {
          if (!review) {
            return Promise.reject(new Error("Review id not found"));
          }
          if (review.user.toString() !== req.userid) {
            return Promise.reject(
              new Error("You are not allowed to delete this review"),
            );
          }
        });
      }
      return true;
    }),
  validator,
];
