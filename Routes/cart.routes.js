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

router
  .route("/")
  .post(addToCartValidator, addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

router.put("/applyCoupon", applyCoupon);

router
  .route("/:itemId")
  .put(updateCartItemValidator, updateCartItemQuantity)
  .delete(removeCartItemValidator, removeCartItem);

export default router;
