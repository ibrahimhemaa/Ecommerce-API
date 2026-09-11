import reviewModel from '../models/reviews.model.js'
import asyncHandler from "express-async-handler";
import { ApiFeatures } from "../utils/api.Features.js";
import {
  createOne,
  deleteOne,
  getAll,
  getByID,
  updateOne,
} from "./handlerFactory.js";

export const createReviewByProductID = (req, res, next) => {
   if (!req.body.product) req.body.product = req.params.productId;
    console.log(req.params);
  console.log(req.body);
    if(!req.body.user) req.body.user = req.userid;
  next();
  
};
export const getReviewsforProductID = (req, res, next) => {
  let filterObject = {};
  if (req.params.productId) filterObject = { product: req.params.productId };
  console.log(req.params.productId)
  req.filterObject = filterObject;
  next();
};
export const createReview = createOne(reviewModel);

export const getReviews = getAll(reviewModel , 'Reviews');

export const getReviewByID = getByID(reviewModel);

export const updateReview = updateOne(reviewModel);

export const deleteReview = deleteOne(reviewModel);
