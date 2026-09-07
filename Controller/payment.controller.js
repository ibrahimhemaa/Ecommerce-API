import stripe from "stripe";
import asyncHandler from "express-async-handler";
import { AppError } from "../utils/errorhandler.js";
import cartModel from "../models/cart.model.js";
import orderModel from "../models/order.model.js";
import productModel from "../models/product.model.js";
import userModel from "../models/user.model.js";

let stripeInstance;
const getStripeInstance = () => {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY)
      throw new AppError(
        500,
        "STRIPE_SECRET_KEY is missing. Add it to config.env if you want card payments.",
      );
    stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  }
  return stripeInstance;
};

export const createCheckoutSession = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.userid });
  if (!cart) return next(new AppError(404, "No cart found"));
  if (cart.cartItems.length === 0)
    return next(new AppError(400, "Cart is empty"));

  const user = await userModel.findById(req.userid);
  if (!user) return next(new AppError(404, "User not found"));

  const totalOrderPrice =
    cart.totalCartPriceAfterDiscount || cart.totalCartPrice;

  const session = await getStripeInstance().checkout.sessions.create({
    line_items: cart.cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        unit_amount: Math.round(item.price * 100),
        product_data: { name: item.product.toString() },
      },
      quantity: item.quantity,
    })),
    mode: "payment",
    success_url: `${req.protocol}://${req.get("host")}/api/orders/checkout-success`,
    cancel_url: `${req.protocol}://${req.get("host")}/api/orders`,
    customer_email: user.email,
    client_reference_id: req.params.id,
    metadata: { cartId: cart._id.toString() },
  });

  res.status(200).json({ message: "Checkout session created", session });
});

export const createCardOrder = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findById(req.params.id);
  if (!cart) return next(new AppError(404, "Cart not found"));

  const order = await orderModel.create({
    user: cart.user,
    cartItems: cart.cartItems,
    totalOrderPrice: cart.totalCartPriceAfterDiscount || cart.totalCartPrice,
    totalOrderPriceAfterDiscount: cart.totalCartPriceAfterDiscount,
    paymentMethodType: "card",
    isPaid: true,
    paidAt: Date.now(),
  });

  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await productModel.bulkWrite(bulkOption, {});
    await cartModel.findByIdAndDelete(cart._id);
  }

  res.status(201).json({ message: "Order created (card paid)", data: order });
});

export const webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  if (!sig) return next(new AppError(400, "Missing stripe signature"));

  let event;
  try {
    event = getStripeInstance()
      .webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
  } catch (error) {
    return next(new AppError(400, `Webhook error: ${error.message}`));
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const cartId = session.metadata.cartId;
    await checkoutSuccess(cartId);
  }

  res.status(200).json({ received: true });
});

const checkoutSuccess = async (cartId) => {
  const cart = await cartModel.findById(cartId);
  if (!cart) return;

  const order = await orderModel.create({
    user: cart.user,
    cartItems: cart.cartItems,
    totalOrderPrice: cart.totalCartPriceAfterDiscount || cart.totalCartPrice,
    totalOrderPriceAfterDiscount: cart.totalCartPriceAfterDiscount,
    paymentMethodType: "card",
    isPaid: true,
    paidAt: Date.now(),
  });

  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await productModel.bulkWrite(bulkOption, {});
    await cartModel.findByIdAndDelete(cartId);
  }
};
