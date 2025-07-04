
import express from "express";
import cookieParser from "cookie-parser";
import pkg from 'dotenv';
import connectDB from "./src/db/config.db.js";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

//routes imported
import authRouter from "./src/routes/auth.router.js";
import serviceRouter from "./src/routes/services.routes.js"
import announcementRouter from "./src/routes/news.router.js"
import projectRouter from "./src/routes/projects.routes.js"
import acheivementRouter from "./src/routes/acheivements.routes.js"
import companyInfoRouter from "./src/routes/companyInfo.router.js"
import emailRouter from "./src/routes/sendMail.router.js"

const {configDotenv} = pkg;

configDotenv();

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend origin
  credentials: true, // Allow credentials (cookies)
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));
app.use(cookieParser());
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
app.use("/api/v1/contact-us",emailRouter);

//server configuration
const PORT = process.env.PORT||8000;
app.listen(PORT,async ()=>{
    await connectDB();
    console.log(`🚀 Server running: http://localhost:${PORT}/api/v1`);
})
 