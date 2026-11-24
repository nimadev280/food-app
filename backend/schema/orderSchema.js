import mongoose from "mongoose";

let orderSchema = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        items: [
            {
                name: String,
                price: Number,
                quantity: Number,
            },
        ],
        total: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            default: "pending",
        },
    },
    { timestamps: true }
);

let Order = mongoose.model("Order", orderSchema);

export default Order;