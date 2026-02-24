"use client";

import { generateSignUrl, completeUploadBgImage } from "@/util/uploadFile";
import axios from "axios";
import { useState, useEffect } from "react";

export default function BgImagesPage() {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(null);

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
  };

  const handleUpload = async () => {
    if (!file) {
      alert("No file selected");
      return;
    }

    setUploading(true);

    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    const ext = file.name.split(".").pop();
    const filename = `bg-images/${Date.now()}.${ext}`;

    const { url } = await generateSignUrl(file, filename, source);

    await completeUploadBgImage(filename, url);

    setUploading(false);
    setCancelTokenSource(null);
    setFile(null);
    fetchImages();
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
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

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
              <button
                className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
                onClick={() => handleDelete(img._id)}
              >
                Delete
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
