import Router from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  getProductByID,
  updateProduct,
  uploadProductImages,
  resizeProductImage
} from "../Controller/product.controller.js";
import {
  createProductValidator,
  deleteProductValidator,
  getProductByIDValidator,
  updateProductValidator,
 } from "../validators/product.validators.js";

import { auth } from "../middleware/auth.middleware.js";
import { allowedTo } from "../middleware/roles.middleware.js";
import { sanitizeEmptyArrayItems } from "../middleware/sanitize.middleware.js";
import reviewRouter from "./review.routes.js";

const router = Router();
router.use('/:productId/reviews', reviewRouter);

router
  .route("/") 
  .post(auth, allowedTo("admin"), uploadProductImages , resizeProductImage , sanitizeEmptyArrayItems, createProductValidator, createProduct)
  .get( getProducts);


router
  .route("/:id")
  .get( getProductByIDValidator, getProductByID)
  .put(auth, allowedTo("admin"), sanitizeEmptyArrayItems, updateProductValidator, updateProduct)
  .delete(auth, allowedTo("admin"), deleteProductValidator, deleteProduct);

export default router;