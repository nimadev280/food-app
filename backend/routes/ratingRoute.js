import { Router } from "express";
import Rating from "../schema/ratingSchema.js";
import Food from "../schema/foodSchema.js";
import requireAuth from "../middleware/auth.js";

const ratingRoute = Router();

ratingRoute.get("/summary", async (req, res) => {
    try {
        const result = await Rating.aggregate([
            {
                $group: {
                    _id: "$food",
                    avg: { $avg: "$stars" },
                    count: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json({ success: true, message: "ratings read successfully", result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

ratingRoute.get("/mine", requireAuth, async (req, res) => {
    try {
        const result = await Rating.find({ user: req.user.id });
        res.status(200).json({ success: true, message: "ratings read successfully", result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});


ratingRoute.post("/", requireAuth, async (req, res) => {
    try {
        const { food, stars } = req.body;

        const dish = await Food.findById(food);
        if (!dish) {
            return res.status(404).json({ success: false, message: "That dish no longer exists." });
        }

        const result = await Rating.findOneAndUpdate(
            { food, user: req.user.id },
            { stars },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ success: true, message: "rating saved", result });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

export default ratingRoute;