import mongoose from "mongoose";
import { Schema } from "mongoose";
const productSchema = new Schema(
  {
    title: {
      type: String,
      minLength: [3, "Product should be greater than 3"],
      maxLength: [32, "Product should be less than 32"],
      trim: true,
      unique: true,
      required: true,
    },
    slug: { type: String, lowercase: true },
    description: {
      type: String,
      require: [true, "Description is required"],
      minLength: [10, "Description should be greater than 10"],
      maxLength: [30, "Description should be less than 32"],
    },
    quantity: { type: Number, required: [true, "quantity is required"] },
    sold: { type: Number, default: 0 },
    price: {
      type: Number,
      required: [true, "Price Should be required"],
      min: [100, "Price Should be more than 100"],
      max: [20000, "Price should be less than 32"],
    },
    priceAfterDiscount: {
      type: Number,
      min: [50, "priceAfterDiscount Should be more than 100"],
      max: [20000, "priceAfterDiscount should be less than 32"],
    },
    color: [String],
    imageCover: { type: String },
    images: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brands",
      required: true,
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be greater than 1"],
      max: [10, "Rating must br less than or equal 10"],
    },
    ratingQuantity: { type: Number, default: 0 },
  },

  { timestamps: true,  toJSON: { virtuals: true },} 
);
productSchema.virtual("reviews", {
  ref: "Reviews",
  foreignField: "product",

  localField: "_id",
});


productSchema.pre(/^find/, async function () {
    this.populate({ path: "category", select: "name -_id" })
});
productSchema.post("init", (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
});
productSchema.post("save", (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
});
productSchema.post("init", (doc) => {
  const images = [];
  if (doc.images) {
    doc.images.forEach((img) => {
      const imageUrl = `${process.env.BASE_URL}/products/${img}`;
      images.push(imageUrl);
    });
  }
  doc.images = images;
});

productSchema.post("save", (doc) => {
  const images = [];
  if (doc.images) {
    doc.images.forEach((img) => {
      const imageUrl = `${process.env.BASE_URL}/products/${img}`;
      images.push(imageUrl);
    });
  }
  doc.images = images;
});

export default mongoose.model("Product", productSchema);
