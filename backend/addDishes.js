import dotenv from "dotenv";
import mongoose from "mongoose";
import Food from "./schema/foodSchema.js";

dotenv.config();

const newDishes = [
    {
        name: "Red Velvet Cake",
        price: 300,
        image: "https://concentrecipes.com/wp-content/uploads/2026/11/red-velvet-cheesecake-cake-2026-11-18-135828-WwueAM7u.webp",
        category: "Dessert",
        description: "Moist red velvet sponge layered with cream cheese frosting.",
    },
    {
        name: "Chow Mein",
        price: 180,
        image: "https://natashaskitchen.com/wp-content/uploads/2020/03/Chicken-Chow-Mein-5-1024x1536.jpg",
        category: "Noodles",
        description: "Stir-fried noodles with vegetables and a light soy sauce.",
    },
];

const missing = newDishes.filter((d) => d.image.startsWith("PASTE_"));
if (missing.length > 0) {
    console.log("Replace the image URL for:", missing.map((d) => d.name).join(", "));
    process.exit(1);
}

try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    for (const dish of newDishes) {
        const exists = await Food.findOne({ name: dish.name });
        if (exists) {
            console.log(`Skipped "${dish.name}" (already in the menu)`);
            continue;
        }
        await Food.create(dish);
        console.log(`Added "${dish.name}"`);
    }
} catch (error) {
    console.log("Failed:", error.message);
} finally {
    await mongoose.disconnect();
}