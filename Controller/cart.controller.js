import asyncHandler from "express-async-handler";
import { AppError } from "../utils/errorhandler.js";
import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

const calcTotalCartPrice = (cart) => {
  let total = 0;
  cart.cartItems.forEach((item) => {
    total += item.price * item.quantity;
  });
  cart.totalCartPrice = total;
  cart.totalCartPriceAfterDiscount = undefined;
};

export const addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId, color, quantity } = req.body;
  const product = await productModel.findById(productId);
  if (!product) return next(new AppError(404, "Product not found"));

  let cart = await cartModel.findOne({ user: req.userid });
  if (!cart) {
    cart = await cartModel.create({
      user: req.userid,
      cartItems: [
        { product: productId, color, quantity, price: product.price },
      ],
    });
  } else {
    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );
    if (productIndex > -1) {
      cart.cartItems[productIndex].quantity += quantity;
    } else {
      cart.cartItems.push({
        product: productId,
        color,
        quantity,
        price: product.price,
      });
    }
  }
  calcTotalCartPrice(cart);
  await cart.save();
  res
    .status(200)
    .json({ message: "Product added to cart", data: cart });
});

export const getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.userid }).populate({
    path: "cartItems.product",
    select: "title imageCover price",
  });
  if (!cart) return next(new AppError(404, "No cart found for this user"));
  res.status(200).json({ message: "Cart retrieved", data: cart });
});

export const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await cartModel.findOne({ user: req.userid });
  if (!cart) return next(new AppError(404, "No cart found"));
  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex === -1) return next(new AppError(404, "Item not found in cart"));
  cart.cartItems[itemIndex].quantity = quantity;
  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({ message: "Quantity updated", data: cart });
});

export const removeCartItem = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndUpdate(
    { user: req.userid },
    { $pull: { cartItems: { _id: req.params.itemId } } },
    { new: true }
  );
  if (!cart) return next(new AppError(404, "No cart found"));
  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({ message: "Item removed", data: cart });
});

export const clearCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOneAndDelete({ user: req.userid });
  if (!cart) return next(new AppError(404, "No cart found"));
  res.status(200).json({ message: "Cart cleared" });
});

export const applyCoupon = asyncHandler(async (req, res, next) => {
  const { coupon } = req.body;
  const cart = await cartModel.findOne({ user: req.userid });
  if (!cart) return next(new AppError(404, "No cart found"));
  const { default: couponModel } = await import("../models/coupon.model.js");
  const couponDoc = await couponModel.findOne({
    name: coupon,
    expire: { $gt: Date.now() },
  });
  if (!couponDoc)
    return next(new AppError(404, "Coupon expired or not valid"));
  const discount = (cart.totalCartPrice * couponDoc.discount) / 100;
  cart.totalCartPriceAfterDiscount = cart.totalCartPrice - discount;
  await cart.save();
  res.status(200).json({
    message: "Coupon applied",
    data: cart,
  });
});
