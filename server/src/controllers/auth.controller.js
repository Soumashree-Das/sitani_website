// import User from "../models/user.model.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import { configDotenv } from "dotenv";

// configDotenv();

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

// // Login user
// export const login = async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ error: "Email and password are required" });
//     }

//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({ error: "Invalid credentials" });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(401).json({ error: "Invalid credentials" });
//         }

//         const { accessToken, refreshToken } = generateTokens(user);
//         user.refreshToken = refreshToken;
//         await user.save();

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

//         return res.status(200).json({
//             message: "Login successful",
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email
//             }
//         });

//     } catch (error) {
//         console.error("Login error:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };

// // Refresh access token
// export const refreshToken = async (req, res) => {
//     const { refreshToken } = req.cookies;

//     if (!refreshToken) {
//         return res.status(401).json({ error: "No refresh token provided" });
//     }

//     try {
//         const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
//         const user = await User.findById(decoded.id);

//         if (!user || user.refreshToken !== refreshToken) {
//             return res.status(403).json({ error: "Invalid refresh token" });
//         }

//         const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
//         user.refreshToken = newRefreshToken;
//         await user.save();

//         res.cookie("accessToken", accessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             maxAge: 30 * 60 * 1000 // 30 minutes
//         });

//         res.cookie("refreshToken", newRefreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === "production",
//             maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
//         });

//         return res.status(200).json({ message: "Token refreshed successfully" });

//     } catch (error) {
//         console.error("Refresh token error:", error);
//         return res.status(403).json({ error: "Invalid refresh token" });
//     }
// };

// // Logout user
// export const logout = async (req, res) => {
//     const { refreshToken } = req.cookies;
    
//     try {
//         if (refreshToken) {
//             // Verify and decode the refresh token
//             const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
            
//             // Invalidate the refresh token in database
//             await User.findByIdAndUpdate(
//                 decoded.id, 
//                 { $set: { refreshToken: null } },
//                 { new: true }
//             );
//         }

//         // Clear both cookies
//         res.clearCookie("accessToken");
//         res.clearCookie("refreshToken");
        
//         return res.status(200).json({ 
//             success: true,
//             message: "Logout successful" 
//         });

//     } catch (error) {
//         console.error("Logout error:", error);
        
//         // Clear cookies even if error occurs
//         res.clearCookie("accessToken");
//         res.clearCookie("refreshToken");
        
//         return res.status(500).json({ 
//             success: false,
//             error: "Internal server error during logout" 
//         });
//     }
// };


import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { configDotenv } from "dotenv";
import multer from "multer";
// import cloudinary from "cloudinary";

configDotenv();

// Update Cloudinary import and configuration
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true // Always use HTTPS
});

// Multer configuration for memory storage
// Update Multer configuration with file filtering
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 5MB
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

// const uploadToCloudinary = async (fileBuffer) => {
//     return new Promise((resolve, reject) => {
//         const stream = cloudinary.v2.uploader.upload_stream(
//             { folder: 'user-profiles' },
//             (error, result) => {
//                 if (error) {
//                     console.error('Cloudinary upload error:', error);
//                     reject(error);
//                 } else {
//                     console.log('Upload successful:', result);
//                     resolve(result);
//                 }
//             }
//         );
//         stream.end(fileBuffer);
//     });
// };
const uploadToCloudinary = async (fileBuffer) => {
    console.log('Starting Cloudinary upload...');
    return new Promise((resolve, reject) => {
        const uploadOptions = {
            folder: 'user-profiles',
            resource_type: 'auto',
            quality: 'auto:good'
        };

        console.log('Creating upload stream with options:', uploadOptions);
        const stream = cloudinary.uploader.upload_stream(
            uploadOptions,
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload failed:', error);
                    reject(error);
                } else {
                    console.log('Upload successful. Public ID:', result.public_id);
                    resolve(result);
                }
            }
        );
        
        console.log('Piping file buffer to upload stream...');
        stream.end(fileBuffer);
    });
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

    //     // Handle profile picture upload if present
    //     if (req.file) {
    //         try {
    //             const result = await uploadToCloudinary(req.file.buffer);
    //             newUser.profilePicture = {
    //                 publicId: result.public_id,
    //                 url: result.secure_url
    //             };
    //         } catch (uploadError) {
    //             console.error("Profile picture upload failed:", uploadError);
    //         }
    //     }

        // const { accessToken, refreshToken } = generateTokens(newUser);
        // newUser.refreshToken = refreshToken;
        // await newUser.save();

        // res.cookie("accessToken", accessToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     maxAge: 30 * 60 * 1000 // 30 minutes
        // });

        // res.cookie("refreshToken", refreshToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        // });

        // return res.status(201).json({
        //     message: "User registered successfully",
        //     user: {
        //         id: newUser._id,
        //         name: newUser.name,
        //         email: newUser.email,
        //         profilePicture: newUser.profilePicture?.url || null
        //     }
        // });

    // } catch (error) {
    //     console.error("Registration error:", error);
    //     return res.status(500).json({ error: "Internal server error" });
    // }
     if (req.file) {
            try {
                console.log('Uploading file to Cloudinary...');
                const result = await uploadToCloudinary(req.file.buffer);
                console.log('Cloudinary upload result:', result);
                
                newUser.profilePicture = {
                    publicId: result.public_id,
                    url: result.secure_url
                };
            } catch (uploadError) {
                console.error("Profile picture upload failed:", uploadError);
                // Optionally continue without failing the registration
                return res.status(400).json({ 
                    error: "Profile picture upload failed",
                    details: uploadError.message 
                });
            }
        }

        // ... rest of registration logic ...
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
                profilePicture: newUser.profilePicture?.url || null
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

// Login user (unchanged)
export const login = async (req, res) => {
    // ... existing login code ...
};

// Refresh token (unchanged)
export const refreshToken = async (req, res) => {
    // ... existing refresh token code ...
};

// Logout user (unchanged)
export const logout = async (req, res) => {
    // ... existing logout code ...
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
        if (user.profilePicture?.publicId) {
            await cloudinary.v2.uploader.destroy(user.profilePicture.publicId);
        }

        // Upload new image
        const result = await uploadToCloudinary(req.file.buffer);
        user.profilePicture = {
            publicId: result.public_id,
            url: result.secure_url
        };

        await user.save();

        return res.status(200).json({
            message: "Profile picture updated successfully",
            profilePicture: user.profilePicture.url
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

        if (user.profilePicture?.publicId) {
            await cloudinary.v2.uploader.destroy(user.profilePicture.publicId);
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