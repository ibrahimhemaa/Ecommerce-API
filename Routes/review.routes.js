import express from "express";
import Router from "express";
import {
  createReview,
  deleteReview,
  getReviews,
  getReviewByID,
  updateReview,
 
} from "../Controller/reviews.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { allowedTo } from "../middleware/roles.middleware.js";
import {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator
} from "../validators/reviews.validators.js";
import {createReviewByProductID,  getReviewsforProductID } from "../Controller/reviews.controller.js";

const router = express.Router({ mergeParams: true }); // لازم يكون هنا


 router
  .route("/")
  .post(auth, allowedTo("user"), createReviewByProductID, createReviewValidator, createReview)
  .get(getReviewsforProductID, getReviews);


router
  .route("/:id")
  .get( getReviewByID)
  .put(auth, allowedTo("user"), updateReviewValidator, updateReview)
  .delete( auth, allowedTo("user", "admin"), deleteReviewValidator, deleteReview);

export default router;