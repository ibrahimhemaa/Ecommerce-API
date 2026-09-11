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

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: Discount coupons (admin)
 */

/**
 * @swagger
 * /coupons:
 *   post:
 *     summary: Create a coupon
 *     tags: [Coupons]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               discount: { type: number }
 *               expire: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Coupon created
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupons]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Coupons retrieved
 */

router
  .route("/")
  .post(createCouponValidator, createCoupon)
  .get(getCoupons);

/**
 * @swagger
 * /coupons/{id}:
 *   get:
 *     summary: Get coupon by ID
 *     tags: [Coupons]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Coupon retrieved
 *   put:
 *     summary: Update a coupon
 *     tags: [Coupons]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Coupon updated
 *   delete:
 *     summary: Delete a coupon
 *     tags: [Coupons]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Coupon deleted
 */

router
  .route("/:id")
  .get(getCouponByIDValidator, getCouponByID)
  .put(updateCouponValidator, updateCoupon)
  .delete(deleteCouponValidator, deleteCoupon);

export default router;
