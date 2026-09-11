import subCategoryModel from "../models/subCategory.model.js";
import asyncHandler from "express-async-handler";
import slugify from "slugify";
import { AppError } from "../utils/errorhandler.js";
import { ApiFeatures } from "../utils/api.Features.js";
import {
  createOne,
  deleteOne,
  getAll,
  getByID,
  updateOne,
} from "./handlerFactory.js";
import productModel from "../models/product.model.js";
export const createSubCategoryByCategoryID = (req, res, next) => {
  if (!req.body.category) req.body.category = req.params.categoryID;
  next();
};
export const getSubCategoriesByCategoryID = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryID) filterObject = { category: req.params.categoryID };
  req.filterObject = filterObject;
  next();
};

export const createSubCategory = createOne(subCategoryModel);

export const getSubCategories = getAll(subCategoryModel, 'SubCategories');

export const getSubCategoryByID = getByID(subCategoryModel);

export const updateSubCategory = updateOne(subCategoryModel);

export const deleteSubCategory = deleteOne(subCategoryModel);
