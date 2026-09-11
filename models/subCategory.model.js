import mongoose from "mongoose";
import { Schema } from "mongoose";
const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name must be required"],
      unique: true,
      minLength: [3, "name must be greater than 3"],
      maxLength: [32, "name must be less than 32"],
    },
    slug: { type: String, lowercase: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Parent Category must be provided"],
    },
  },
  { timestamps: true },
);

export default mongoose.model("subCategory", subCategorySchema);
