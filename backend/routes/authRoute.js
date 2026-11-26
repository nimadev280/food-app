import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../schema/userSchema.js";
import requireAuth from "../middleware/auth.js";

const authRoute = Router();

const signToken = (user) =>
    jwt.sign(
        { id: user._id, name: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

const publicUser = (user) => ({ id: user._id, name: user.name, email: user.email });

authRoute.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required.",
            });
        }
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters.",
            });
        }

        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists.",
            });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hash });

        res.status(201).json({
            success: true,
            message: "Account created.",
            token: signToken(user),
            user: publicUser(user),
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

authRoute.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: (email || "").toLowerCase() }).select(
            "+password"
        );

        const ok = user && (await bcrypt.compare(password || "", user.password));
        if (!ok) {
            return res.status(401).json({
                success: false,
                message: "Email or password is incorrect.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Logged in.",
            token: signToken(user),
            user: publicUser(user),
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

authRoute.get("/me", requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({ success: false, message: "Account not found." });
        }
        res.status(200).json({ success: true, message: "ok", user: publicUser(user) });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

export default authRoute;