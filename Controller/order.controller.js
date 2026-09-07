import asyncHandler from "express-async-handler";
import { AppError } from "../utils/errorhandler.js";
import cartModel from "../models/cart.model.js";
import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";
import {
  createOne,
  getAll,
  getByID,
} from "./handlerFactory.js";

export const createCashOrder = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.userid });
  if (!cart) return next(new AppError(404, "No cart found"));
  if (cart.cartItems.length === 0)
    return next(new AppError(400, "Cart is empty"));

  const order = await orderModel.create({
    user: req.userid,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice: cart.totalCartPriceAfterDiscount || cart.totalCartPrice,
    totalOrderPriceAfterDiscount: cart.totalCartPriceAfterDiscount,
    paymentMethodType: "cash",
  });

  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await productModel.bulkWrite(bulkOption, {});
    await cartModel.findOneAndDelete({ user: req.userid });
  }

  res.status(201).json({ message: "Order created (cash on delivery)", data: order });
});

export const createCheckoutSession = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.userid });
  if (!cart) return next(new AppError(404, "No cart found"));
  if (cart.cartItems.length === 0)
    return next(new AppError(400, "Cart is empty"));

  const totalOrderPrice =
    cart.totalCartPriceAfterDiscount || cart.totalCartPrice;

  const order = await orderModel.create({
    user: req.userid,
    cartItems: cart.cartItems,
    shippingAddress: req.body.shippingAddress,
    totalOrderPrice,
    totalOrderPriceAfterDiscount: cart.totalCartPriceAfterDiscount,
    paymentMethodType: "card",
  });

  res.status(201).json({ message: "Order created for payment", data: order });
});

export const filterOrdersForLoggedUser = (req, res, next) => {
  req.filterObject = { user: req.userid };
  next();
};

export const getOrder = getByID(orderModel, { path: "user", select: "name email" });

export const getAllOrders = getAll(orderModel, "Orders");

export const updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findByIdAndUpdate(
    req.params.id,
    { isPaid: true, paidAt: Date.now() },
    { new: true }
  );
  if (!order) return next(new AppError(404, "Order not found"));
  res.status(200).json({ message: "Order marked as paid", data: order });
});

export const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await orderModel.findByIdAndUpdate(
    req.params.id,
    { isDelivered: true, deliveredAt: Date.now() },
    { new: true }
  );
  if (!order) return next(new AppError(404, "Order not found"));
  res.status(200).json({ message: "Order marked as delivered", data: order });
});
