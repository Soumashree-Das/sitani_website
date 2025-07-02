import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI , {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log(`MongoDB Connected: ${connection.connection.host}`);
    
    // Error handling
    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected");
    });

    return connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;