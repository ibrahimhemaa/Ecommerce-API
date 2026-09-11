import Router from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryByID,
  updateCategory,
  uploadCategories,
  resizeImage,
} from "../Controller/category.controller.js";
import {
  createCategoryValidator,
  deleteCategoryValidator,
  getCategoryByIDValidator,
  updateCategoryValidator,
} from "../validators/category.validators.js";
import subCategoriesRoutes from "./subCategory.route.js";
import { auth } from "../middleware/auth.middleware.js";
import { allowedTo } from "../middleware/roles.middleware.js";

const router = Router();
router.use("/:categoryID/subcategories", subCategoriesRoutes);

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category operations
 */

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a category (admin)
 *     tags: [Categories]
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
 *         description: Category created
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Categories retrieved
 */

router
  .route("/")
  .post(
    auth,
    allowedTo("admin"),
    uploadCategories,
    resizeImage,
    createCategoryValidator,
    createCategory,
  )
  .get(auth, allowedTo("admin", "user"), getCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category retrieved
 *   put:
 *     summary: Update a category (admin)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category updated
 *   delete:
 *     summary: Delete a category (admin)
 *     tags: [Categories]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category deleted
 */

router
  .route("/:id")
  .get(
    auth,
    allowedTo("admin", "user"),
    getCategoryByIDValidator,
    getCategoryByID,
  )
  .put(
    auth,
    allowedTo("admin"),
    uploadCategories,
    resizeImage,
    updateCategoryValidator,
    updateCategory,
  )
  .delete(auth, allowedTo("admin"), deleteCategoryValidator, deleteCategory);

export default router;