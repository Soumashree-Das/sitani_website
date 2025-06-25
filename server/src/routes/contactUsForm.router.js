import { Router } from "express";
import { createContactInfo, getContactInfo, updateContactInfo, } from "../controllers/contactusForm.controller.js";

const router = Router();

router.post("/createContactInfo",createContactInfo);        //http://localhost:8090/api/v1/contact-us/createContactInfo
router.get("/getContactInfo",getContactInfo);               //http://localhost:8090/api/v1/contact-us/getContactInfo
router.patch("/updateContactInfo/:id",updateContactInfo);   //http://localhost:8090/api/v1/contact-us/updateContactInfo/:id

export default router;
