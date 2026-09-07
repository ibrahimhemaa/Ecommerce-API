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

router
  .route("/")
  .post(addToWishlistValidator, addProductToWishlist)
  .get(getLoggedUserWishlist);

router.delete(
  "/:productId",
  removeFromWishlistValidator,
  removeProductFromWishlist
);

export default router;
