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

router
  .route("/:id")
  .put(auth, allowedTo("admin"), updateSubCategoryValidator, updateSubCategory)
  .get(getSubCategoryByIDValidator, getSubCategoryByID)
  .delete(auth, allowedTo("admin"), deleteSubCategoryValidator, deleteSubCategory);

export default router;