
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { configDotenv } from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";

configDotenv();

// Configure storage for local file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads/profile-pictures');

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// Multer configuration for local storage
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Middleware for handling profile picture upload
export const uploadProfilePicture = upload.single('profilePicture');

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

        // Handle profile picture upload if present
        // if (req.file) {
        //     // Store the relative path in the database
        //     newUser.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
        // }
        // When handling file uploads (register or update)
        if (req.file) {
            // Store the absolute path
            const fullPath = path.join(process.cwd(), 'uploads', 'profile-pictures', req.file.filename);
            newUser.profilePicture = fullPath;
        }

        console.log(newUser.profilePicture);

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
                email: newUser.email,
                profilePicture: newUser.profilePicture || null
            }
        });

    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({
            error: "Internal server error",
            details: error.message
        });
    }
};

// Update user profile picture
export const updateProfilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Delete old image if exists
        if (user.profilePicture) {
            const oldImagePath = path.join(process.cwd(), user.profilePicture);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        // Store new image path
        user.profilePicture = `/uploads/profile-pictures/${req.file.filename}`;
        await user.save();

        return res.status(200).json({
            message: "Profile picture updated successfully",
            profilePicture: user.profilePicture
        });

    } catch (error) {
        console.error("Profile picture update error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Remove profile picture
export const removeProfilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.profilePicture) {
            const imagePath = path.join(process.cwd(), user.profilePicture);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
            user.profilePicture = null;
            await user.save();
        }

        return res.status(200).json({
            message: "Profile picture removed successfully"
        });

    } catch (error) {
        console.error("Remove profile picture error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// // Keep your existing login, refreshToken, and logout functions unchanged

// // Generate tokens
// const generateTokens = (user) => {
//     const accessToken = jwt.sign(
//         { id: user._id, email: user.email },
//         process.env.ACCESS_TOKEN,
//         { expiresIn: "30m" }
//     );

//     const refreshToken = jwt.sign(
//         { id: user._id },
//         process.env.REFRESH_TOKEN,
//         { expiresIn: "7d" }
//     );

//     return { accessToken, refreshToken };
// };

// // Register a new user
// export const register = async (req, res) => {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//         return res.status(400).json({ error: "All fields are required!" });
//     }

//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ error: "Email already in use" });
//         }

//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         const newUser = new User({
//             name,
//             email,
//             password: hashedPassword,
//             refreshToken: null
//         });

//         const { accessToken, refreshToken } = generateTokens(newUser);
//         newUser.refreshToken = refreshToken;
//         await newUser.save();

//         res.cookie("accessToken", accessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             maxAge: 30 * 60 * 1000 // 30 minutes
//         });

//         res.cookie("refreshToken", refreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//         });

//         return res.status(201).json({
//             message: "User registered successfully",
//             user: {
//                 id: newUser._id,
//                 name: newUser.name,
//                 email: newUser.email
//             }
//         });

//     } catch (error) {
//         console.error("Registration error:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };

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

// // Verify authentication status
// export const verifyAuth = async (req, res) => {
//   try {
//     // The auth middleware will have already verified the token
//     // If we get here, the user is authenticated
//     return res.json({ isAuthenticated: true });
//   } catch (error) {
//     return res.json({ isAuthenticated: false });
//   }
// };

// In your auth controller
export const verifyAuth = async (req, res) => {
  try {
    // Verify access token from cookies
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      return res.json({ isAuthenticated: false });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.json({ isAuthenticated: false });
    }

    // Additional checks (optional)
    if (user.refreshToken !== req.cookies.refreshToken) {
      return res.json({ isAuthenticated: false });
    }

    return res.json({ 
      isAuthenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return res.json({ isAuthenticated: false });
  }
};