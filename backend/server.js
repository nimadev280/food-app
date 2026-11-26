import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import foodRoute from "./routes/foodRoute.js";
import orderRoute from "./routes/orderRoute.js";
import authRoute from "./routes/authRoute.js";
import ratingRoute from "./routes/ratingRoute.js";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/auth", authRoute);
app.use("/food", foodRoute);
app.use("/order", orderRoute);
app.use("/rating", ratingRoute);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT || 8000, () =>
            console.log(`Server running on port ${process.env.PORT || 8000}`)
        );
    })
    .catch((err) => console.log("MongoDB connection failed:", err.message));