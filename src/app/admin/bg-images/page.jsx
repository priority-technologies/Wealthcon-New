"use client";

import axios from "axios";
import { useState, useEffect } from "react";

export default function BgImagesPage() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(null);
  const [imageType, setImageType] = useState("Auth Image");
  const [showImageTypeModal, setShowImageTypeModal] = useState(false);

  // Fetch existing images
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const res = await fetch("/api/admin/bg-images");
    try {
      const data = await res.json();
      if (Array.isArray(data)) {
        setImages(data);
      } else {
        console.error("Unexpected response:", data);
        setImages([]);
      }
    } catch (err) {
      console.error("Failed to parse images:", err);
      setImages([]);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setShowImageTypeModal(true);
  };

  const handleImageTypeSelect = (type) => {
    setImageType(type);
    setShowImageTypeModal(false);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("imageType", imageType);

      const response = await axios.post(
        "/api/admin/upload/bg-images/direct",
        formData
      );

      if (response.data.success) {
        alert("Image uploaded successfully!");
        setFile(null);
        setImageType("Auth Image");
        fetchImages();
      } else {
        alert("Upload failed: " + (response.data.error || "Unknown error"));
      }
    } catch (error) {
      alert("Upload error: " + (error.response?.data?.error || error.message));
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      await axios.put(`/api/admin/bg-images/${id}`, {
        isActive: !currentStatus,
      });
      fetchImages();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/admin/bg-images/${id}`);
    } catch (error) {
      console.error(error);
    }
    fetchImages();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Background Images</h1>

      <div className="mb-4 flex gap-2 items-center">
        <input type="file" onChange={handleFileChange} />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleUpload}
          disabled={uploading || !file}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {file && (
          <span className="text-sm text-gray-600">Type: {imageType}</span>
        )}
      </div>

      {showImageTypeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-bold mb-4">Select Image Type</h2>
            <div className="space-y-3">
              <button
                className={`w-full px-4 py-3 rounded text-left font-semibold transition ${
                  imageType === "Auth Image"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
                onClick={() => handleImageTypeSelect("Auth Image")}
              >
                Auth Image (Login/Register)
              </button>
              <button
                className={`w-full px-4 py-3 rounded text-left font-semibold transition ${
                  imageType === "Banner Image"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900 hover:bg-gray-300"
                }`}
                onClick={() => handleImageTypeSelect("Banner Image")}
              >
                Banner Image (Page Header)
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.isArray(images) &&
          images.map((img) => (
            <div key={img._id} className="border p-2 rounded shadow">
              <img
                src={img.path}
                alt={img.filename}
                className="w-full h-40 object-cover"
              />
              <p className="text-sm mt-2 truncate">{img.filename}</p>
              <p className="text-xs text-gray-500">Type: {img.imageType || "Auth Image"}</p>
              <div className="mt-2 flex gap-2">
                <button
                  className={`flex-1 px-2 py-1 rounded text-sm ${
                    img.isActive
                      ? "bg-green-500 text-white"
                      : "bg-gray-400 text-white"
                  }`}
                  onClick={() => handleToggleActive(img._id, img.isActive)}
                >
                  {img.isActive ? "Active" : "Inactive"}
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                  onClick={() => handleDelete(img._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
