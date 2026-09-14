import express from "express";
import {
  addProductToWishlist,
  getLoggedUserWishlist,
  removeProductFromWishlist,
} from "../Controller/wishlist.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { allowedTo } from "../middleware/roles.middleware.js";
import {
  addToWishlistValidator,
  removeFromWishlistValidator,
} from "../validators/wishlist.validators.js";

const router = express.Router();

router.use(auth, allowedTo("user"));

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: User wishlist
 */

/**
 * @swagger
 * /wishlist:
 *   post:
 *     summary: Add product to wishlist
 *     tags: [Wishlist]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId: { type: string }
 *     responses:
 *       200:
 *         description: Product added to wishlist
 *   get:
 *     summary: Get logged user's wishlist
 *     tags: [Wishlist]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Wishlist retrieved
 */

router
  .route("/")
  .post(addToWishlistValidator, addProductToWishlist)
  .get(getLoggedUserWishlist);

/**
 * @swagger
 * /wishlist/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags: [Wishlist]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 */

router.delete(
  "/:productId",
  removeFromWishlistValidator,
  removeProductFromWishlist
);

export default router;
