import asyncHandler from "express-async-handler";
import { AppError } from "../utils/errorhandler.js";
import couponModel from "../models/coupon.model.js";
import {
  createOne,
  deleteOne,
  getAll,
  getByID,
  updateOne,
} from "./handlerFactory.js";

export const createCoupon = createOne(couponModel);
export const getCoupons = getAll(couponModel, "Coupons");
export const getCouponByID = getByID(couponModel);
export const updateCoupon = updateOne(couponModel);
export const deleteCoupon = deleteOne(couponModel);
