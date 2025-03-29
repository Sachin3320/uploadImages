import { activateImage, addImg, delete_images, getAll_Images, updateImg } from "../Controller/imgController.js";
import express from "express";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const imgRouter = express.Router();

// Corrected Upload Middleware
imgRouter.post("/addImg", upload.array("images", 4), addImg);
imgRouter.patch("/updateImg/:id/:imgKey" ,upload.single('image') , updateImg )
imgRouter.get("/getall_images" , getAll_Images)
imgRouter.delete("/delete/:id" , delete_images)
imgRouter.post("/activateimg/:id" , activateImage)

export default imgRouter;
