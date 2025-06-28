import express from "express";
import cookieParser from "cookie-parser";
import pkg from 'dotenv';
import morgan from "morgan";
import connectDB from "./src/db/config.db.js";
import multer from "multer";
import bodyParser from "body-parser";

//routes imported
import authRouter from "./src/routes/auth.router.js";
import serviceRouter from "./src/routes/services.routes.js"
import announcementRouter from "./src/routes/news.router.js"
import projectRouter from "./src/routes/projects.routes.js"
import acheivementRouter from "./src/routes/acheivements.routes.js"
import aboutUsRouter from "./src/routes/aboutUs.router.js"
import contactUsRouter from "./src/routes/contactUsForm.router.js"

const {configDotenv} = pkg;

configDotenv();

const app = express();

//middlewares
app.use(express.json());
// app.use(morgan("tiny"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


import { initializeGridFS } from './src/controllers/acheivements.controller.js';
// import { initializeServicesGridFS } from "./src/controllers/services.controller.js";

// After MongoDB connection is established
const mongoUri = process.env.MONGO_URI;
await initializeGridFS(mongoUri);
// await initializeServicesGridFS(mongoUri);

const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory for GridFS
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB file size limit
  }
});
//routes
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/services",serviceRouter);
app.use("/api/v1/announcements",announcementRouter);//http://localhost:8090/api/v1/announcements
app.use("/api/v1/projects",projectRouter);
app.use("/api/v1/acheivements",acheivementRouter);//http://localhost:8090/api/v1/announcements
app.use("/api/v1/contact-us",contactUsRouter);
app.use("/api/v1/about-us",aboutUsRouter);


//server configuration
const PORT = process.env.PORT||8000;
app.listen(PORT,async ()=>{
    await connectDB();
    console.log(`server running : http://localhost:${PORT}/api/v1`)})
