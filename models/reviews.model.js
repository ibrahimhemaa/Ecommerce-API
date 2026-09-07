import mongoose from "mongoose";
const reviewSchema = new mongoose.Schema(
  {
    title: { type: String },
    ratings: {
      type: Number,
      required: true,
      min: [1, "Rating must be greater than 1"],
      max: [5, "Rating must be less than or equal 5"],
    },
    user: {  type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true },
);

reviewSchema.pre(/^find/, async function () {
    this.populate({ path: "user", select: "name" })
});
export default mongoose.model("Reviews", reviewSchema);
