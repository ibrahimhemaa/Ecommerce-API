import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import mongoose from "mongoose";
import userModel from "../models/user.model.js";

const email = process.argv[2] || "test@gmail.com";

try {
  await mongoose.connect(process.env.uriDB);
  const result = await userModel.updateOne({ email }, { role: "admin" });
  console.log(`Matched: ${result.matchedCount} Modified: ${result.modifiedCount}`);

  const users = await userModel.find({}, "email role").lean();
  users.forEach((u) => console.log(`${u.role.padEnd(6)} ${u.email}`));
} catch (err) {
  console.error("make:admin failed:", err.message.split("\n")[0]);
} finally {
  await mongoose.disconnect();
}