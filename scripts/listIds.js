import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import mongoose from "mongoose";
import categoryModel from "../models/category.model.js";
import brandModel from "../models/brand.model.js";

try {
  await mongoose.connect(process.env.URIDB);
  console.log("=== CATEGORIES ===");
  const cats = await categoryModel.find().lean();
  cats.forEach((c) => console.log(`${c._id}  ${c.name}`));
  console.log("=== BRANDS ===");
  const brands = await brandModel.find().lean();
  brands.forEach((b) => console.log(`${b._id}  ${b.name}`));
} catch (err) {
  console.error("failed:", err.message.split("\n")[0]);
} finally {
  await mongoose.disconnect();
}