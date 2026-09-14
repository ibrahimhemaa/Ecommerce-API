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

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product operations
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a product (admin)
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               quantity: { type: integer }
 *               price: { type: number }
 *               priceAfterDiscount: { type: number }
 *               color: { type: array, items: { type: string } }
 *               imageCover: { type: string, format: binary }
 *               images: { type: array, items: { type: string, format: binary } }
 *               category: { type: string }
 *               subCategories: { type: array, items: { type: string } }
 *               brand: { type: string }
 *     responses:
 *       201:
 *         description: Product created
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Products retrieved
 */

router
  .route("/") 
  .post(auth, allowedTo("admin"), uploadProductImages , resizeProductImage , sanitizeEmptyArrayItems, createProductValidator, createProduct)
  .get( getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product retrieved
 *   put:
 *     summary: Update a product (admin)
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product updated
 *   delete:
 *     summary: Delete a product (admin)
 *     tags: [Products]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Product deleted
 */

router
  .route("/:id")
  .get( getProductByIDValidator, getProductByID)
  .put(auth, allowedTo("admin"), uploadProductImages, resizeProductImage, sanitizeEmptyArrayItems, updateProductValidator, updateProduct)
  .delete(auth, allowedTo("admin"), deleteProductValidator, deleteProduct);

export default router;