import path from 'path'
import { fileURLToPath } from 'url';

import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import bodyParser from "body-parser";

import categoryRoutes from "./Routes/category.routes.js";
import subCategoriesRoutes from "./Routes/subCategory.route.js";
import brandsRoutes from "./Routes/brand.routes.js";
import productsRoutes from "./Routes/product.routes.js";
import userRoutes from './Routes/user.routes.js'
import authRoutes from './Routes/auth.routes.js'
import reviewRoutes from "./Routes/review.routes.js";
import cartRoutes from "./Routes/cart.routes.js";
import couponRoutes from "./Routes/coupon.routes.js";
import orderRoutes from "./Routes/order.routes.js";
import wishlistRoutes from "./Routes/wishlist.routes.js";
import paymentRoutes from "./Routes/payment.routes.js";
import { webhookCheckout } from "./Controller/payment.controller.js";

import { connectDB } from "./DB/db.js";
import { AppError } from "./utils/errorhandler.js";
import { globalError } from "./middleware/error.middleware.js";
import { swaggerDocs, swaggerSetup } from "./utils/swagger.js";


const app = express();
dotenv.config({ path: "./config.env" });
connectDB();
app.use(morgan("dev"));

// Stripe webhook needs the raw body BEFORE express.json()
app.post("/api/payments/webhook", express.raw({ type: "application/json" }), webhookCheckout);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'uploads')));

app.use(
  "/api/docs",
  swaggerDocs,
  swaggerSetup
);

app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoriesRoutes);
app.use("/api/brands", brandsRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/payments", paymentRoutes);

app.all(/.*/, (req, res, next) => {
  next(new AppError(404, "Route not Found"));
});

app.use(globalError);
process.on("unhandledRejection", (err) => {
  console.log("Error on" + err);
  process.exit(1);
});
export default app;
