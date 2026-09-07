import mongoose from "mongoose";
const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    color: { type: String },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartItems: [cartItemSchema],
    totalCartPrice: { type: Number, default: 0 },
    totalCartPriceAfterDiscount: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
