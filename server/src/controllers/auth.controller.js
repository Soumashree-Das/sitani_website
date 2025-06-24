import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { configDotenv } from "dotenv";

configDotenv();

// Generate tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.ACCESS_TOKEN,
        { expiresIn: "30m" }
    );
    
    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN,
        { expiresIn: "7d" }
    );
    
    return { accessToken, refreshToken };
};

// Register a new user
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required!" });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            refreshToken: null
        });

        const { accessToken, refreshToken } = generateTokens(newUser);
        newUser.refreshToken = refreshToken;
        await newUser.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 60 * 1000 // 30 minutes
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Login user
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = generateTokens(user);
        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 60 * 1000 // 30 minutes
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Refresh access token
export const refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({ error: "No refresh token provided" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ error: "Invalid refresh token" });
        }

        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 30 * 60 * 1000 // 30 minutes
        });

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        return res.status(200).json({ message: "Token refreshed successfully" });

    } catch (error) {
        console.error("Refresh token error:", error);
        return res.status(403).json({ error: "Invalid refresh token" });
    }
};

// Logout user
export const logout = async (req, res) => {
    const { refreshToken } = req.cookies;
    
    try {
        if (refreshToken) {
            // Verify and decode the refresh token
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
            
            // Invalidate the refresh token in database
            await User.findByIdAndUpdate(
                decoded.id, 
                { $set: { refreshToken: null } },
                { new: true }
            );
        }

        // Clear both cookies
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        
        return res.status(200).json({ 
            success: true,
            message: "Logout successful" 
        });

    } catch (error) {
        console.error("Logout error:", error);
        
        // Clear cookies even if error occurs
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        
        return res.status(500).json({ 
            success: false,
            error: "Internal server error during logout" 
        });
    }
};