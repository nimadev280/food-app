import dns from "dns";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import foodRoute from "./routes/foodRoute.js";
import orderRoute from "./routes/orderRoute.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

let app = express();
let port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use("/food", foodRoute);
app.use("/order", orderRoute);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected to mongodb");
        app.listen(port, "0.0.0.0", () => {
            console.log(`server running on port ${port}`);
        });
    })
    .catch((error) => {
        console.log(error.message);
    });