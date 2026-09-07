import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getCouponByID,
  getCoupons,
  updateCoupon,
} from "../Controller/coupon.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { allowedTo } from "../middleware/roles.middleware.js";
import {
  createCouponValidator,
  deleteCouponValidator,
  getCouponByIDValidator,
  updateCouponValidator,
} from "../validators/coupon.validators.js";

const router = express.Router();

router.use(auth, allowedTo("admin"));


router
  .route("/")
  .post(createCouponValidator, createCoupon)
  .get(getCoupons);


router
  .route("/:id")
  .get(getCouponByIDValidator, getCouponByID)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

export default router;
