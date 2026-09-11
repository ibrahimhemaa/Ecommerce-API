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

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product reviews
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a review (user)
 *     tags: [Reviews]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               ratings: { type: number }
 *               product: { type: string }
 *     responses:
 *       201:
 *         description: Review created
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Reviews retrieved
 */

 router
  .route("/")
  .post(auth, allowedTo("user"), createReviewByProductID, createReviewValidator, createReview)
  .get(getReviewsforProductID, getReviews);

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review retrieved
 *   put:
 *     summary: Update a review (owner only)
 *     tags: [Reviews]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review updated
 *   delete:
 *     summary: Delete a review (owner/admin)
 *     tags: [Reviews]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Review deleted
 */

router
  .route("/:id")
  .get( getReviewByID)
  .put(auth, allowedTo("user"), updateReviewValidator, updateReview)
  .delete( auth, allowedTo("user", "admin"), deleteReviewValidator, deleteReview);

export default router;