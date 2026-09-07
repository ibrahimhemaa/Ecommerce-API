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

router.get(
  "/:id",
  auth,
  allowedTo("user", "admin"),
  getOrderValidator,
  getOrder
);


router.put(
  "/:id/pay",
  auth,
  allowedTo("admin"),
  getOrderValidator,
  updateOrderToPaid
);
router.put(
  "/:id/deliver",
  auth,
  allowedTo("admin"),
  getOrderValidator,
  updateOrderToDelivered
);

export default router;
