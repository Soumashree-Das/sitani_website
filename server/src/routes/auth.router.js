
// import { Router } from "express";
// import { login, logout, register } from "../controllers/auth.controller.js";

// const router = Router();

// router.post("/login",login);
// router.post("/register",register);
// router.post("/logout",logout);

// export default router;

import express from "express";
import {
    register,
    login,
    refreshToken,
    logout,
    uploadProfilePicture,
    updateProfilePicture,
    removeProfilePicture,
    verifyAuth
} from "../controllers/auth.controller.js";

const router = express.Router();

// Registration with optional profile picture
router.post("/register", uploadProfilePicture, register);

// Login
router.post("/login", login);

// Refresh token
router.post("/refresh-token", refreshToken);

// Logout
router.post("/logout", logout);

// Update profile picture
router.put("/profile-picture", uploadProfilePicture, updateProfilePicture);

// Remove profile picture
router.delete("/profile-picture", removeProfilePicture);

router.get('/verify', verifyAuth); // Add this to your auth routes

export default router;