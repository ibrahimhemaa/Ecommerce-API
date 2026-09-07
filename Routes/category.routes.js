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