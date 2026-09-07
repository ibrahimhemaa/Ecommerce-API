import mongoose from "mongoose";
import { Schema } from "mongoose";
const categorySchema = new Schema(
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
categorySchema.post("init",  (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/Categories/${doc.image}`;
    doc.image = imageUrl;
  }
});

categorySchema.post('save', function(doc) {
    if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/Categories/${doc.image}`;
    doc.image = imageUrl;
  }
 });
export default mongoose.model("Category", categorySchema);
