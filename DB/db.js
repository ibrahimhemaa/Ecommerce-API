import mongoose from "mongoose";
export const connectDB = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.URIDB).then(() => {
    console.log("Database Connected Successfully");
  });
};
