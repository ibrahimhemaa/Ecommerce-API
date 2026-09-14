import { Router } from "express";
import express from "express";
import {
  createSubCategory,
  updateSubCategory,
  getSubCategories,
  getSubCategoryByID,
  deleteSubCategory,
  createSubCategoryByCategoryID,
  getSubCategoriesByCategoryID,
} from "../Controller/subCategory.controller.js";

import {
  createSubCategoryValidator,
  updateSubCategoryValidator,
  getSubCategoriesValidator,
  getSubCategoryByIDValidator,
  deleteSubCategoryValidator,
} from "../validators/subCategory.validators.js";
import { auth } from "../middleware/auth.middleware.js";
import { allowedTo } from "../middleware/roles.middleware.js";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: SubCategories
 *   description: Sub-category operations
 */

/**
 * @swagger
 * /subcategories:
 *   post:
 *     summary: Create a sub-category
 *     tags: [SubCategories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               category: { type: string }
 *     responses:
 *       201:
 *         description: Sub-category created
 *   get:
 *     summary: Get all sub-categories
 *     tags: [SubCategories]
 *     responses:
 *       200:
 *         description: Sub-categories retrieved
 */

router
  .route("/")
  .post(
    auth,
    allowedTo("admin"),
    createSubCategoryByCategoryID,
    createSubCategoryValidator,
    createSubCategory,
  )
  .get(
    getSubCategoriesByCategoryID,
    getSubCategoriesValidator,
    getSubCategories,
  );

/**
 * @swagger
 * /subcategories/{id}:
 *   put:
 *     summary: Update a sub-category
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Sub-category updated
 *   get:
 *     summary: Get sub-category by ID
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Sub-category retrieved
 *   delete:
 *     summary: Delete a sub-category
 *     tags: [SubCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Sub-category deleted
 */

router
  .route("/:id")
  .put(auth, allowedTo("admin"), updateSubCategoryValidator, updateSubCategory)
  .get(getSubCategoryByIDValidator, getSubCategoryByID)
  .delete(auth, allowedTo("admin"), deleteSubCategoryValidator, deleteSubCategory);

export default router;