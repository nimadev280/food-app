import { Router } from "express";
import Food from "../schema/foodSchema.js";

let foodRoute = Router();

foodRoute
    .route("/")
    .post(async (req, res, next) => {
        try {
            let result = await Food.create(req.body);
            res.status(200).json({
                success: true,
                message: "food created successfully",
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
            let result = await Food.find();
            res.status(200).json({
                success: true,
                message: "food read successfully",
                result: result,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    });

foodRoute
    .route("/:id")
    .get(async (req, res, next) => {
        try {
            let result = await Food.findById(req.params.id);
            res.status(200).json({
                success: true,
                message: "food read successfully",
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
            let result = await Food.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });
            res.status(200).json({
                success: true,
                message: "food updated successfully",
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
            let result = await Food.findByIdAndDelete(req.params.id);
            res.status(200).json({
                success: true,
                message: "food deleted successfully",
                result: result,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    });

export default foodRoute;