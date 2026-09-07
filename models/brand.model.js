import mongoose from "mongoose";
import { Schema } from "mongoose";
const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be provided"],
      unique: true,
      minLength: [3, "Name must be more than 3 char"],
      maxLength: [32, "Name must be less than 32 char"],
    },
    slug: { type: String, lowercase: true },
    image: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Brands", brandSchema);
