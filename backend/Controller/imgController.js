import { uploadFileToCloudinary ,deleteFileFromCloudinary } from "../utils/Cloudinary.js";
import Image from "../models/images.js";
import { DiBackbone } from "react-icons/di";


export const addImg = async (req, res) => {
  try {
    const files = req.files; // Access uploaded files
    

    // Upload images to Cloudinary and wait for results
    const uploadedFiles = await uploadFileToCloudinary(files);

    // Log all URLs and public IDs
    uploadedFiles.forEach((file, index) => {
      console.log(`Image ${index + 1}: URL: ${file.secure_url}, Public ID: ${file.public_id}`);
    });

    // Store images in MongoDB
    const storeData = new Image({
      img1: uploadedFiles[0] || { url: "", public_id: "" },
      img2: uploadedFiles[1] || { url: "", public_id: "" },
      img3: uploadedFiles[2] || { url: "", public_id: "" },
      img4: uploadedFiles[3] || { url: "", public_id: "" },
    });

    await storeData.save(); // Save to MongoDB
    console.log("Stored in database:", storeData);

    return res.json({ 
      status: "success", 
      message: "Images uploaded & stored successfully!",
      uploadedFiles,
      savedData: storeData
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return res.status(500).json({ 
      status: "error", 
      message: "Image upload failed!", 
      error 
    });
  }
};

export const updateImg = async (req, res) => {
    try {
      const { id, imgKey } = req.params; // `id` = MongoDB ID, `imgKey` = "img1", "img2", etc.
      const newFile = req.file; // New image from request
  
      if (!newFile) {
        return res.status(400).json({ status: "error", message: "No new image provided" });
      }
  
      const imageDoc = await Image.findById(id);
      if (!imageDoc) {
        return res.status(404).json({ status: "error", message: "Image document not found" });
      }
  
      const oldPublicId = imageDoc[imgKey]?.public_id;
  
      // Update Cloudinary
      const deleteImage = await deleteFileFromCloudinary(oldPublicId);
      const updateImage = await  uploadFileToCloudinary(req.file)
  
      // Update MongoDB
      imageDoc[imgKey] = updateImage;
      await imageDoc.save();
  
      return res.json({ 
        status: "success", 
        message: "Image updated successfully!", 
        updatedImage 
      });
    } catch (error) {
      console.error("Image update error:", error);
      return res.status(500).json({ status: "error", message: "Image update failed!", error });
    }
  };

export const getAll_Images = async (req , res )=>{

    try {
        const data = await Image.find({})
        return res.status(200).json({
            "status" :" sucessFully fetch all images",
             data
        })

    }catch (err) {
        console.error("Error fetching the image:", err);
        return res.status(500).json({ status: "error", message: "Failed to fetching image", error: err });
    }

}

export const delete_images =  async (req , res)=>{
    try {
        const id = req.params
        const deleteImg = await Image.findByIdAndDelete(id)

    }catch (err) {
        console.error("Error deleting the image:", err);
        return res.status(500).json({ status: "error", message: "Failed to delete image", error: err });

        }

    }
