import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
    {
        food: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        stars: { type: Number, required: true, min: 1, max: 5 },
    },
    { timestamps: true }
);


ratingSchema.index({ food: 1, user: 1 }, { unique: true });

const Rating = mongoose.model("Rating", ratingSchema);
export default Rating;