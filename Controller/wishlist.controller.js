import asyncHandler from "express-async-handler";
import { AppError } from "../utils/errorhandler.js";
import userModel from "../models/user.model.js";

export const addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.userid,
    { $addToSet: { wishlist: req.body.productId } },
    { new: true }
  );
  if (!user) return next(new AppError(404, "User not found"));
  res.status(200).json({
    message: "Product added to wishlist",
    data: user.wishlist,
  });
});

export const removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.userid,
    { $pull: { wishlist: req.params.productId } },
    { new: true }
  );
  if (!user) return next(new AppError(404, "User not found"));
  res.status(200).json({
    message: "Product removed from wishlist",
    data: user.wishlist,
  });
});

export const getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await userModel
    .findById(req.userid)
    .populate({ path: "wishlist", select: "title imageCover price" });
  if (!user) return next(new AppError(404, "User not found"));
  res.status(200).json({
    message: "Wishlist retrieved",
    data: user.wishlist,
  });
});
