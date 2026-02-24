import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import "./uploader.scss";

// const fileTypes = ["JPEG", "PNG", "GIF"];
// const fileTypes = ["Mp4"]

export default function Uploader({
  filename,
  title,
  fileTypes,
  multiple,
  classes,
  onChange,
  error
}) {
  return (
    <div className="App">
      <FileUploader
        multiple={multiple}
        handleChange={onChange}
        name="file"
        types={fileTypes}
        label={title}
        classes={`custom-uploader ${classes}`}
      />
      <p>{filename && `File name: ${filename}`}</p>
      {error && <div className="text-red-600">{error}</div>}
      {/* : "no files uploaded yet" */}
    </div>
  );
}
