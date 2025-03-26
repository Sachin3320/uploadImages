import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

const ImageManagement = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [previews, setPreviews] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/getAll_Images");
      setImages(res.data.data);
    } catch (err) {
      console.error("Error fetching images", err);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] && data[key][0]) {
        formData.append("images", data[key][0]);
      }
    });

    try {
      await axios.post("http://localhost:5000/api/addImg", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus("Upload Successful!");
      fetchImages();
    } catch (err) {
      setUploadStatus("Upload Failed!");
    }

    setIsModalOpen(false);
  };

  const handleImageChange = (event, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      setPreviews((prev) => ({ ...prev, [fieldName]: URL.createObjectURL(file) }));
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/delete/${id}`);
      fetchImages();
    } catch (err) {
      console.error("Error deleting image", err);
    }
  };

  return (
    <div className="p-6">
      <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md">Add Image</button>
      {uploadStatus && <p className="mt-2 text-lg font-semibold">{uploadStatus}</p>}

      {/* Scrollable Image Gallery */}
      <div className="overflow-x-auto whitespace-nowrap p-4 mt-6 border rounded-md shadow-md">
        <div className="flex gap-4">
          {images.map((img, index) => (
            <div key={index} className="flex flex-col items-center gap-2 p-2 border rounded-md shadow-md min-w-[200px]">
              <img src={img.img1.secure_url} alt="Uploaded" className="w-32 h-32 object-cover rounded-md" />
              <div className="flex gap-2">
                <button className="bg-red-500 text-white px-2 py-1 rounded-md" onClick={() => handleDelete(img._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-center mb-4">Upload Images</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              {["img1", "img2", "img3", "img4"].map((img, index) => (
                <div key={index} className="flex flex-col items-center">
                  <input
                    type="file"
                    accept="image/*"
                    {...register(img, { required: `Image ${index + 1} is required` })}
                    onChange={(e) => handleImageChange(e, img)}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  {errors[img] && <p className="text-red-500 text-xs mt-1">{errors[img].message}</p>}

                  {previews[img] && (
                    <img src={previews[img]} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-md shadow-md" />
                  )}
                </div>
              ))}

              {/* Buttons - Always Visible */}
              <div className="flex justify-between mt-4 sticky bottom-0 bg-white py-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageManagement;
