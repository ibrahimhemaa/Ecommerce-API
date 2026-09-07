import express from "express";
import {
  createCardOrder,
  createCheckoutSession,
  webhookCheckout,
} from "../Controller/payment.controller.js";
import { auth } from "../middleware/auth.middleware.js";
import { allowedTo } from "../middleware/roles.middleware.js";

const router = express.Router();

router.get(
  "/checkout-session/:id",
  auth,
  allowedTo("user"),
  createCheckoutSession
);

router.post("/webhook", webhookCheckout);


router.post(
  "/create-card-order/:id",
  auth,
  allowedTo("user"),
  createCardOrder
);

export default router;
