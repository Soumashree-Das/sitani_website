// import express from "express";
// import cookieParser from "cookie-parser";
// import pkg from 'dotenv';
// import morgan from "morgan";
// import connectDB from "./src/db/config.db.js";
// import multer from "multer";
// import bodyParser from "body-parser";
// import cors from "cors";

// //routes imported
// import authRouter from "./src/routes/auth.router.js";
// import serviceRouter from "./src/routes/services.routes.js"
// import announcementRouter from "./src/routes/news.router.js"
// import projectRouter from "./src/routes/projects.routes.js"
// import acheivementRouter from "./src/routes/acheivements.routes.js"
// import companyInfoRouter from "./src/routes/companyInfo.router.js"
// // import aboutUsRouter from "./src/routes/aboutUs.router.js"
// // import contactUsRouter from "./src/routes/contactUsForm.router.js"

// const {configDotenv} = pkg;

// configDotenv();

// const app = express();

// //middlewares
// app.use(express.json());
// app.use(cors({
//   origin: 'http://localhost:5173', // Your frontend origin
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(cookieParser());
// app.use(express.urlencoded({ extended: true })); 
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// const mongoUri = process.env.MONGO_URI;

// //routes
// app.use("/api/v1/auth",authRouter);
// app.use("/api/v1/services",serviceRouter);
// app.use("/api/v1/announcements",announcementRouter);
// app.use("/api/v1/projects",projectRouter);
// app.use("/api/v1/acheivements",acheivementRouter);
// app.use("/api/v1/companyInfo",companyInfoRouter)


// //server configuration
// const PORT = process.env.PORT||8000;
// app.listen(PORT,async ()=>{
//     await connectDB();
//     console.log(`server running : http://localhost:${PORT}/api/v1`)})

import express from "express";
import cookieParser from "cookie-parser";
import pkg from 'dotenv';
import morgan from "morgan";
import connectDB from "./src/db/config.db.js";
import multer from "multer";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//routes imported
import authRouter from "./src/routes/auth.router.js";
import serviceRouter from "./src/routes/services.routes.js"
import announcementRouter from "./src/routes/news.router.js"
import projectRouter from "./src/routes/projects.routes.js"
import acheivementRouter from "./src/routes/acheivements.routes.js"
import companyInfoRouter from "./src/routes/companyInfo.router.js"

const {configDotenv} = pkg;

configDotenv();

const app = express();

//middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//routes
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/services",serviceRouter);
app.use("/api/v1/announcements",announcementRouter);
app.use("/api/v1/projects",projectRouter);
app.use("/api/v1/acheivements",acheivementRouter);
app.use("/api/v1/companyInfo",companyInfoRouter);

//server configuration
const PORT = process.env.PORT||8000;
app.listen(PORT,async ()=>{
    await connectDB();
    console.log(`🚀 Server running: http://localhost:${PORT}/api/v1`);
    console.log(`📁 Static files served from: http://localhost:${PORT}/uploads`);
})