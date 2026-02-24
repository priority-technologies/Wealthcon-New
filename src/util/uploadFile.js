import axios from "axios";

export async function initiateUpload(filename, filetype, cancelToken) {
  try {
    const response = await axios.post(
      "/api/admin/upload/initiate",
      {
        fileName: filename,
        fileType: filetype,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        cancelToken: cancelToken.token,
      }
    );

    const { UploadId } = response.data;
    return UploadId;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error("Request canceled", error.message);
      throw new Error("cancel");
    }
    console.error("Error initiating upload", error);
    throw error;
  }
}

export async function uploadPart(
  file,
  filename,
  partNumber,
  uploadId,
  partSize,
  cancelToken
) {
  try {
    const start = (partNumber - 1) * partSize;
    const end = Math.min(file.size, start + partSize);
    const chunk = file.slice(start, end);

    // Send FormData with actual chunk data
    const form = new FormData();
    form.append("uploadId", uploadId);
    form.append("partNumber", String(partNumber));
    form.append("chunk", chunk, `chunk-${partNumber}`);

    const response = await axios.post(
      "/api/admin/upload/chunk",
      form,
      {
        cancelToken: cancelToken.token,
      }
    );

    return {
      ETag: response.data.ETag,
      PartNumber: response.data.PartNumber,
    };
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error(`Upload part ${partNumber} canceled`);
      throw new Error("cancel");
    } else {
      console.error(`Error uploading part ${partNumber}`, error);
      throw error;
    }
  }
}

export async function completeUploadVideo(
  filename,
  uploadId,
  parts,
  cancelToken
) {
  try {
    const result = await axios.post(
      "/api/admin/upload/complete-video",
      {
        fileName: filename,
        uploadId,
        parts,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        cancelToken: cancelToken.token,
      }
    );
    return result.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error("Request canceled");
      throw new Error("cancel");
    } else {
      console.error("Error completing video upload", error);
      throw error;
    }
  }
}

export async function insertUploadVideoDB(
  filename,
  videoUrl,
  thumbnailName,
  thumbnailUrl,
  date,
  shorts,
  title,
  description,
  studentCategory,
  videoCategory,
  duration,
  channelId,
  cancelToken
) {
  try {
    const result = await axios.post(
      "/api/admin/upload/video",
      {
        fileName: filename,
        videoUrl,
        thumbnailName,
        thumbnailUrl,
        date,
        shorts,
        title,
        description,
        studentCategory,
        videoCategory,
        duration,
        channelId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        cancelToken: cancelToken.token,
      }
    );
    return result.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error("Request canceled");
      throw new Error("cancel");
    } else {
      console.error("Error completing upload", error);
      throw error;
    }
  }
}

export async function uploadVideoThumbnail(
  thumbnail,
  filename,
  filetype,
  cancelToken
) {
  try {
    // Send FormData with actual thumbnail file
    const form = new FormData();
    form.append("file", thumbnail, thumbnail.name);
    form.append("fileName", filename);

    const response = await axios.post(
      "/api/admin/upload/thumbnail",
      form,
      {
        cancelToken: cancelToken.token,
      }
    );

    return { thumbnailUrl: response.data.url };
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error("Thumbnail upload canceled");
      throw new Error("cancel");
    } else {
      console.error("Error uploading thumbnail", error);
      throw error;
    }
  }
}

export async function generateSignUrl(file, filename, cancelToken) {
  try {
    const { data } = await axios.post(
      "/api/admin/upload/signed-url",
      {
        fileName: filename,
        fileType: file.type,
      },
      {
        cancelToken: cancelToken.token, // Pass cancelToken directly
      }
    );

    const { uploadUrl } = data;

    // Upload the file using the presigned URL
    const uploadResponse = await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
      cancelToken: cancelToken.token,
    });

    if (uploadResponse.status !== 200) throw new Error("Failed to upload part");
    return { url: uploadUrl.split("?")[0], name: filename };
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error(`Upload canceled`);
      throw new Error("cancel");
    } else {
      console.error(`Error uploading `, error);
      throw error;
    }
  }
}

export async function completeUploadNotes(
  filename,
  notesUrl,
  thumbnailName,
  thumbnailUrl,
  date,
  title,
  description,
  studentCategory,
  pageCount,
  type,
  cancelToken
) {
  try {
    const result = await axios.post(
      "/api/admin/upload/notes",
      {
        filename,
        notesUrl,
        thumbnailName,
        thumbnailUrl,
        date,
        title,
        description,
        studentCategory,
        pageCount,
        type,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        cancelToken: cancelToken.token,
      }
    );

    return result.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.errror("Request canceled");
      throw new Error("cancel");
    } else {
      console.error("Error completing upload", error);
      throw error;
    }
  }
}

export async function completeUploadGallary(
  filename,
  url,
  date,
  title,
  description,
  studentCategory,
  cancelToken
) {
  try {
    await axios.post(
      "/api/admin/upload/gallery",
      {
        filename,
        url,
        date,
        title,
        description,
        studentCategory,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        cancelToken: cancelToken.token,
      }
    );
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error("Request canceled");
      throw new Error("cancel");
    } else {
      console.error("Error completing upload", error);
      throw error;
    }
  }
}

export async function completeUploadBgImage(filename, url) {
  try {
    await axios.post(
      "/api/admin/upload/bg-images",
      {
        filename,
        url,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error completing upload", error);
  }
}

export async function carryAndIncrementV(oldPath, newPath) {
  const oldV = (() => {
    const query = oldPath.split("?")[1] || "";
    const params = new URLSearchParams(query);
    return parseInt(params.get("v")) || 0;
  })();

  const base = newPath.split("?")[0];
  const query = newPath.split("?")[1] || "";
  const params = new URLSearchParams(query);
  params.set("v", oldV + 1);

  return `${base}?${params.toString()}`;
}