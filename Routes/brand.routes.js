import Router from "express";
import {
  createBrand,
  deleteBrand,
  getBrands,
  getBrandByID,
  updateBrand,
  uploadBrandImages,
} from "../Controller/brand.controller.js";
import {
  createBrandValidator,
  getBrandByIDValidator,
  getBrandsValidator,
  deleteBrandValidator,
  updateBrandValidator,
} from "../validators/brand.validators.js";
import { resizeImage } from "../Controller/brand.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { allowedTo } from "../middleware/roles.middleware.js";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Brands
 *   description: Brand operations
 */

/**
 * @swagger
 * /brands:
 *   post:
 *     summary: Create a brand
 *     tags: [Brands]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               image: { type: string, format: binary }
 *     responses:
 *       201:
 *         description: Brand created
 *   get:
 *     summary: Get all brands
 *     tags: [Brands]
 *     responses:
 *       200:
 *         description: Brands retrieved
 */

router
  .route("/")
  .post( auth, allowedTo("admin"), uploadBrandImages, resizeImage, createBrandValidator, createBrand)
  .get(getBrandsValidator, getBrands);

/**
 * @swagger
 * /brands/{id}:
 *   get:
 *     summary: Get brand by ID
 *     tags: [Brands]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Brand retrieved
 *   put:
 *     summary: Update a brand (admin)
 *     tags: [Brands]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Brand updated
 *   delete:
 *     summary: Delete a brand (admin)
 *     tags: [Brands]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Brand deleted
 */

router
  .route("/:id")
  .get( auth, allowedTo("admin", "user"), getBrandByIDValidator, getBrandByID)
  .put( auth, allowedTo("admin"), updateBrandValidator, updateBrand)
  .delete( auth, allowedTo("admin"), deleteBrandValidator, deleteBrand);

export default router;