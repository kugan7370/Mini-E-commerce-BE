import express from "express";
const app = express();
import userRoutes from "./userRoute.js";
import productRoutes from "./productRoute.js";
import categoryRoutes from "./categoryRoute.js";

app.use("/user", userRoutes);
app.use("/product", productRoutes);
app.use("/category", categoryRoutes);

export default app;
