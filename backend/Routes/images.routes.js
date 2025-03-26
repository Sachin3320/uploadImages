import { addImg, getAll_Images, updateImg } from "../Controller/imgController.js";
import express from "express";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const imgRouter = express.Router();

// Corrected Upload Middleware
imgRouter.post("/addImg", upload.array("images", 4), addImg);
imgRouter.patch("/updateImg" ,upload.single('image') , updateImg )
imgRouter.get("/getall_images" , getAll_Images)

export default imgRouter;
