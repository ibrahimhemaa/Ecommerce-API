import express from "express";
import {
  createCashOrder,
  getAllOrders,
  getOrder,
  updateOrderToDelivered,
  updateOrderToPaid,
  filterOrdersForLoggedUser,
} from "../Controller/order.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { allowedTo } from "../middleware/roles.middleware.js";
import {
  createCashOrderValidator,
  getOrderValidator,
} from "../validators/order.validators.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a cash-on-delivery order from the cart
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   details: { type: string }
 *                   phone: { type: string }
 *                   city: { type: string }
 *                   postalCode: { type: string }
 *     responses:
 *       201:
 *         description: Order created
 *   get:
 *     summary: Get logged user's orders
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Orders retrieved
 */

router.post(
  "/",
  auth,
  allowedTo("user"),
  createCashOrderValidator,
  createCashOrder
);

router.get(
  "/",
  auth,
  allowedTo("user"),
  filterOrdersForLoggedUser,
  getAllOrders
);

/**
 * @swagger
 * /orders/admin:
 *   get:
 *     summary: Get all orders (admin)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Orders retrieved
 */

router.get("/admin", auth, allowedTo("admin"), getAllOrders);

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order retrieved
 */

router.get(
  "/:id",
  auth,
  allowedTo("user", "admin"),
  getOrderValidator,
  getOrder
);

/**
 * @swagger
 * /orders/{id}/pay:
 *   put:
 *     summary: Mark order as paid (admin)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order marked as paid
 */

router.put(
  "/:id/pay",
  auth,
  allowedTo("admin"),
  getOrderValidator,
  updateOrderToPaid
);

/**
 * @swagger
 * /orders/{id}/deliver:
 *   put:
 *     summary: Mark order as delivered (admin)
 *     tags: [Orders]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order marked as delivered
 */

router.put(
  "/:id/deliver",
  auth,
  allowedTo("admin"),
  getOrderValidator,
  updateOrderToDelivered
);

export default router;
