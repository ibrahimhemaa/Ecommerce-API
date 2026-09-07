import mongoose from "mongoose";
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon name is required"],
      unique: true,
      trim: true,
    },
    discount: {
      type: Number,
      required: [true, "Discount percentage is required"],
      min: [1, "Discount must be at least 1%"],
      max: [100, "Discount cannot exceed 100%"],
    },
    expire: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
