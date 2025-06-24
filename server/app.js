import express from "express";
import cookieParser from "cookie-parser";
import pkg from 'dotenv';
import morgan from "morgan";
import connectDB from "./src/db/config.db.js";

//routes imported
import authRouter from "./src/routes/auth.router.js"

const {configDotenv} = pkg;

configDotenv();

const app = express();

//middlewares
app.use(express.json());
app.use(morgan("tiny"));
app.use(cookieParser());

//routes
app.use("/api/v1/auth",authRouter);


//server configuration
const PORT = process.env.PORT||8000;
app.listen(PORT,async ()=>{
    await connectDB();
    console.log(`server running : http://localhost:${PORT}`)})
