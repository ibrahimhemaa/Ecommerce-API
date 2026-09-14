import express from "express";
import {
  addProductToCart,
  getLoggedUserCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
  applyCoupon,
} from "../Controller/cart.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { allowedTo } from "../middleware/roles.middleware.js";
import {
  addToCartValidator,
  updateCartItemValidator,
  removeCartItemValidator,
} from "../validators/cart.validators.js";

const router = express.Router();

router.use(auth, allowedTo("user"));

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Shopping cart operations
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add product to cart
 *     tags: [Cart]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId: { type: string }
 *               color: { type: string }
 *               quantity: { type: integer }
 *     responses:
 *       200:
 *         description: Product added to cart
 *   get:
 *     summary: Get logged user's cart
 *     tags: [Cart]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Cart retrieved
 *   delete:
 *     summary: Clear the cart
 *     tags: [Cart]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Cart cleared
 */

router
  .route("/")
  .post(addToCartValidator, addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

/**
 * @swagger
 * /cart/applyCoupon:
 *   put:
 *     summary: Apply a discount coupon
 *     tags: [Cart]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coupon: { type: string }
 *     responses:
 *       200:
 *         description: Coupon applied
 */

router.put("/applyCoupon", applyCoupon);

/**
 * @swagger
 * /cart/{itemId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity: { type: integer }
 *     responses:
 *       200:
 *         description: Quantity updated
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Item removed
 */

router
  .route("/:itemId")
  .put(updateCartItemValidator, updateCartItemQuantity)
  .delete(removeCartItemValidator, removeCartItem);

export default router;
