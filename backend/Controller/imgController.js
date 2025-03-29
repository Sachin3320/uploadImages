import {
  uploadFileToCloudinary,
  deleteFileFromCloudinary,
} from "../utils/Cloudinary.js";
import Image from "../models/images.js";

export const addImg = async (req, res) => {
  try {
    const files = req.files; // Access uploaded files

    // Upload images to Cloudinary and wait for results
    const uploadedFiles = await uploadFileToCloudinary(files);

    // Log all URLs and public IDs


    // Store images in MongoDB
    const storeData = new Image({
      img1: uploadedFiles[0] || { url: "", public_id: "" },
      img2: uploadedFiles[1] || { url: "", public_id: "" },
      img3: uploadedFiles[2] || { url: "", public_id: "" },
      img4: uploadedFiles[3] || { url: "", public_id: "" },
    });

    await storeData.save(); // Save to MongoDB
   

    return res.json({
      status: "success",
      message: "Images uploaded & stored successfully!",
      uploadedFiles,
      savedData: storeData,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return res.status(500).json({
      status: "error",
      message: "Image upload failed!",
      error,
    });
  }
};

export const updateImg = async (req, res) => {
  try {
    const { id, imgKey } = req.params; // `id` = MongoDB ID, `imgKey` = "img1", "img2", etc.
    const newFile = req.file; // New image from request

    if (!newFile) {
      return res
        .status(400)
        .json({ status: "error", message: "No new image provided" });
    }

    const imageDoc = await Image.findById(id);
    if (!imageDoc) {
      return res
        .status(404)
        .json({ status: "error", message: "Image document not found" });
    }

    const oldPublicId = imageDoc[imgKey]?.public_id;

    // Update Cloudinary
    const deleteImage = await deleteFileFromCloudinary(oldPublicId);
    const updateImage = await uploadFileToCloudinary(req.file);

    // Update MongoDB
    imageDoc[imgKey] = updateImage;
    await imageDoc.save();

    return res.json({
      status: "success",
      message: "Image updated successfully!",
      updatedImage,
    });
  } catch (error) {
    console.error("Image update error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Image update failed!", error });
  }
};

export const getAll_Images = async (req, res) => {
  try {
    const data = await Image.find({});
    return res.status(200).json({
      status: " sucessFully fetch all images",
      data,
    });
  } catch (err) {
    console.error("Error fetching the image:", err);
    return res
      .status(500)
      .json({
        status: "error",
        message: "Failed to fetching image",
        error: err,
      });
  }
};

export const delete_images = async (req, res) => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);
    if (!image) {
      return res
        .status(404)
        .json({ status: "error", message: "Image not found" });
    }
    const ids = [image.img1.public_id, image.img2.public_id, image.img3.public_id, image.img4.public_id];
    for (const public_id of ids) {
      deleteFileFromCloudinary(public_id); // Deletes from Cloudinary
  }
    const deleteImg = await Image.findByIdAndDelete(id);
  } catch (err) {
    console.error("Error deleting the image:", err);
    return res
      .status(500)
      .json({ status: "error", message: "Failed to delete image", error: err });
  }
};
export const activateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Image.updateMany(
      { Active: true },
      { $set: { Active: false } }
    );

    const findToActivate = await Image.findById(id);
    if (!findToActivate) {
      return res.status(404).json({
        status: "error",
        message: "data not found",
      });
    }
    findToActivate.Active = true;
    await findToActivate.save();
    res.status(200).json({
      status: "success",
      message: "image activated successfully",
    });
  } catch (err) {
    console.log("Error in activating image", err);
    res.status(500).json({
      status: "error",
      message: "failed to activate image",
    });
  }
};
