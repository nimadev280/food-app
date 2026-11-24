import dns from "dns";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "./schema/foodSchema.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dotenv.config();

const img = (file) =>
    `https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=500`;

let foods = [
    {
        name: "Margherita Pizza",
        price: 650,
        category: "Pizza",
        description: "Classic cheese and tomato pizza",
        image: img("Pizza_Margherita_stu_spivack.jpg"),
    },
    {
        name: "Hamburger",
        price: 350,
        category: "Burger",
        description: "Beef patty with lettuce and sauce",
        image: img("Hamburger_(black_bg).jpg"),
    },
    {
        name: "Steamed Momo",
        price: 220,
        category: "Momo",
        description: "Steamed dumplings with spicy achar",
        image: img("Plateful_of_Momo_in_Nepal.jpg"),
    },
    {
        name: "Jhol Momo",
        price: 250,
        category: "Momo",
        description: "Momo served in a spicy soup",
        image: img("Jhol_Momo.jpg"),
    },
    {
        name: "French Fries",
        price: 180,
        category: "Snacks",
        description: "Crispy salted fries",
        image: img("Fries_2.jpg"),
    },
    {
        name: "Black Forest Cake",
        price: 300,
        category: "Dessert",
        description: "Chocolate cake with cream and cherries",
        image: img("Black_Forest_gateau.jpg"),
    },
];

mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        await Food.deleteMany({});
        await Food.insertMany(foods);
        console.log("food seeded");
        process.exit(0);
    })
    .catch((error) => {
        console.log(error.message);
        process.exit(1);
    });