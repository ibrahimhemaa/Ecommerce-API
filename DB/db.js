import mongoose from "mongoose";
export const connectDB = async () => {
  mongoose.set("strictQuery", false);
  await mongoose.connect(process.env.uriDB).then(() => {
    console.log("Database Connected Successfully");
  });
};
