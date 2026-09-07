import asyncHandler from "express-async-handler";
import { AppError } from "../utils/errorhandler.js";

export const allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.role))
      return next(new AppError(403, "You are Not allowed to access this page"));

    next();
  });
