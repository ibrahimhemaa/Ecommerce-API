import express from "express";
import {
  createCardOrder,
  createCheckoutSession,
  webhookCheckout,
} from "../Controller/payment.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { allowedTo } from "../middleware/roles.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Stripe payment integration
 */

/**
 * @swagger
 * /payments/checkout-session/{id}:
 *   get:
 *     summary: Create a Stripe checkout session for a cart
 *     tags: [Payments]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Cart ID
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Checkout session created
 */

router.get(
  "/checkout-session/:id",
  auth,
  allowedTo("user"),
  createCheckoutSession
);

/**
 * @swagger
 * /payments/webhook:
 *   post:
 *     summary: Stripe webhook to confirm payment
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Webhook received
 */

router.post("/webhook", webhookCheckout);

/**
 * @swagger
 * /payments/create-card-order/{id}:
 *   post:
 *     summary: Create a card-paid order from a cart
 *     tags: [Payments]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Cart ID
 *         schema: { type: string }
 *     responses:
 *       201:
 *         description: Order created
 */

router.post(
  "/create-card-order/:id",
  auth,
  allowedTo("user"),
  createCardOrder
);

export default router;
