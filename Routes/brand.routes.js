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

router
  .route("/")
  .post( auth, allowedTo("admin"), uploadBrandImages, resizeImage, createBrandValidator, createBrand)
  .get(getBrandsValidator, getBrands);
  
router
  .route("/:id")
  .get( auth, allowedTo("admin", "user"), getBrandByIDValidator, getBrandByID)
  .put( auth, allowedTo("admin"), updateBrandValidator, updateBrand)
  .delete( auth, allowedTo("admin"), deleteBrandValidator, deleteBrand);

export default router;