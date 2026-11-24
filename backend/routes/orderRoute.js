import { Router } from "express";
import Order from "../schema/orderSchema.js";

let orderRoute = Router();

orderRoute
    .route("/")
    .post(async (req, res, next) => {
        try {
            let result = await Order.create(req.body);
            res.status(200).json({
                success: true,
                message: "order placed successfully",
                result: result,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    })
    .get(async (req, res, next) => {
        try {
            let result = await Order.find().sort({ createdAt: -1 });
            res.status(200).json({
                success: true,
                message: "order read successfully",
                result: result,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    });

orderRoute
    .route("/:id")
    .get(async (req, res, next) => {
        try {
            let result = await Order.findById(req.params.id);
            res.status(200).json({
                success: true,
                message: "order read successfully",
                result: result,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    })
    .patch(async (req, res, next) => {
        try {
            let result = await Order.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            res.status(200).json({
                success: true,
                message: "order updated successfully",
                result: result,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    })
    .delete(async (req, res, next) => {
        try {
            let result = await Order.findByIdAndDelete(req.params.id);
            res.status(200).json({
                success: true,
                message: "order deleted successfully",
                result: result,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    });

export default orderRoute;