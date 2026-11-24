import mongoose from "mongoose";

let foodSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            default: "General",
        },
        description: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

let Food = mongoose.model("Food", foodSchema);

export default Food;