import asyncHandler from "express-async-handler";
import { AppError } from "../utils/errorhandler.js";
import { ApiFeatures } from "../utils/api.Features.js";
import userModel from "../models/user.model.js";
import slugify from "slugify";

export const createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.create({ ...req.body });
    if (Model === userModel) {
      document.password = undefined;
    }
    res
      .status(201)
      .json({ message: "data Created Successfully", data: document });
  });

export const updateOne = (Model) =>
  asyncHandler(async (req, res) => {
    if (Model === userModel) {
      const userDoc = await Model.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          email: req.body.email,
          slug: slugify(req.body.name),
          role: req.body.rule,
          phone: req.body.phone,
          imgProfile: req.body.imgProfile,
        },
        { new: true },
      );
      if (!userDoc)
        return next(new AppError(404, `${req.params.id} Not Found `));
      return res
        .status(201)
        .json({ message: ` updated Successfully`, data: userDoc });
    }
    const document = await Model.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
     { returnDocument: 'after' } 

    );
    if (!document)
      return next(new AppError(404, `${req.params.id} Not Found `));
    res.status(201).json({ message: ` updated Successfully`, data: document });
  });

export const deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (Model === userModel) {
      const userDocument = await Model.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true },
      );
      if (!userDocument) return next(new AppError(404, ` Not Found`));
      return res
        .status(201)
        .json({ message: ` Deleted Successfully `, data: userDocument });
    }

    const document = await Model.findByIdAndDelete(id);
    if (!document) return next(new AppError(404, ` Not Found`));
    res.status(201).json({ message: ` Deleted Successfully `, data: document });
  });

export const getByID = (Model , populateOptions) =>
  asyncHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const document = await query;

    if (!document) return next(new AppError(404, " Not Found "));
    res.status(200).json({ message: "data retrieved Successfully", document });
  });
export const getAll = (Model, mainMode) =>
  asyncHandler(async (req, res, next) => {
    let filter = {};
    if (req.filterObject) {
      filter = req.filterObject;
    }

    const countDocument = Model.countDocuments();
    const apiFeatures = new ApiFeatures(req.query, Model.find(filter))
      .filter()
      .pagination(countDocument)
      .search(mainMode)
      .sort()
      .limitFields();

    const document = await apiFeatures.builderQuery;
    if (!document) return next(new AppError(404, " Not Found "));

    return res.status(200).json({
      message: " Data retrieved Successfully",
      page: apiFeatures.paginationResult,
      data: document,
    });
  });
