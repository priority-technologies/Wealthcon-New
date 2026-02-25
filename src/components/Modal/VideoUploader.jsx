"use client";

import { Fragment, useContext, useRef, useState, useEffect } from "react";
import "./modal.scss";
import CloseIcon from "../../assets/images/svg/closeIcon.svg";
import Button from "../Button";
import Uploader from "../Uploader";
import Typography from "../Typography";
import Input from "../Input";
import Textarea from "../Input/Textarea";
import InputChecks from "../Input/InputChecks";
import ProgressBar from "../ProgressBar";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
  completeUploadVideo,
  initiateUpload,
  insertUploadVideoDB,
  uploadPart,
  uploadVideoThumbnail,
  pollConversionStatus,
} from "../../util/uploadFile";

import axios from "axios";
import SuccessModal from "./SuccessModal";
import { UserContext } from "@/app/_context/User";
import { getCurrentDateTime, secToMin } from "@/helpers/all";
import { adminRoles, roleOptions } from "@/helpers/constant";

const VideoUploader = ({ showModal, setShowModal, modalTitle }) => {
  const videoRef = useRef(null);
  const { setLiveSessions } = useContext(UserContext);

  const [progress, setProgress] = useState(0);
  const [btnLoading, setBtnLoading] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const [videoDuration, setVideoDuration] = useState(0);
  const [channels, setChannels] = useState([]);
  const [uploadPhaseComplete, setUploadPhaseComplete] = useState(false);
  const [conversionStarted, setConversionStarted] = useState(false);

  // Fetch channels on mount
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axios.get("/api/admin/channels");
        setChannels(response.data.channels || []);
      } catch (error) {
        console.error("Error fetching channels:", error);
      }
    };
    fetchChannels();
  }, []);

  const formik = useFormik({
    initialValues: {
      date: "",
      file: "",
      thumbnail: "",
      title: "",
      shorts: false,
      description: "",
      studentCategory: [],
      videoCategory: "",
      channelId: "",
    },
    validationSchema: Yup.object({
      date: Yup.date()
        .required("Date is required")
        .nullable()
        .typeError("Invalid date format"),
      file: Yup.mixed().required("Video file is required"),
      title: Yup.string().required("Title is required").trim(),
      description: Yup.string().required("Description is required").trim(),
      studentCategory: Yup.array()
        .of(Yup.string().oneOf(adminRoles, "Invalid category"))
        .min(1, "At least one category is required"),
    }),
    onSubmit: async (values) => {
      try {
        await handleUploadVideo(values);
      } catch (error) {
        setBtnLoading(false);
        if (error.message === "cancel") {
          return;
        }
        if (error?.response?.status === 401) {
          return router.push("/login");
        }
        setSuccessModal(true);
        setError(true);
        setMsg("An error occurred. Please try again.");
        console.error("Error during submission:", error.message);
      } finally {
        setProgress(0);
      }
    },
  });

  const closeModal = () => {
    formik.resetForm();
    setShowModal(false);
    setBtnLoading(false);

    if (cancelTokenSource) {
      cancelTokenSource.cancel("Upload canceled by user");
      setCancelTokenSource(null);
    }
  };

  const handleUploadVideo = async (values) => {
    let {
      file,
      thumbnail,
      date,
      title,
      shorts,
      description,
      studentCategory,
      videoCategory,
      channelId,
    } = values;

    // Set default videoCategory if not provided
    videoCategory = videoCategory || "live";

    if (!file) {
      alert("No file selected");
      return;
    }

    setBtnLoading(true);

    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    const ext = file.name.split(".").pop();
    const filename = `sessions/${Date.now()}.${ext}`;
    const filetype = file.type;

    setProgress(1);
    const uploadId = await initiateUpload(filename, filetype, source);

    setProgress(5);
    const this500MB = 524288000;
    let chunkMb = 10;
    if (file.size > this500MB) {
      chunkMb = 50;
    }

    const CHUNK_SIZE = chunkMb * 1024 * 1024;
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const parts = [];

    for (let i = 1; i <= totalChunks; i++) {
      const part = await uploadPart(
        file,
        filename,
        i,
        uploadId,
        CHUNK_SIZE,
        source
      );
      parts.push(part);
      const uploadProgress = 5 + (i / totalChunks) * 90;
      setProgress(Math.round(uploadProgress));
    }

    let thumbnailName = "",
      thumbnailUrl = "";
    if (thumbnail) {
      const thumbnailExt = thumbnail.name.split(".").pop();
      thumbnailName = `${Date.now()}.${thumbnailExt}`;
      const thumbnailFiletype = thumbnail.type;

      const response = await uploadVideoThumbnail(
        thumbnail,
        thumbnailName,
        thumbnailFiletype,
        source
      );

      console.log("Thumbnail upload response:", response);
      thumbnailUrl = response.thumbnailUrl;
      console.log("Thumbnail URL extracted:", thumbnailUrl);
    }
    setProgress(93);

    const { url } = await completeUploadVideo(
      filename,
      uploadId,
      parts,
      source
    );

    setProgress(97);

    const { insertId } = await insertUploadVideoDB(
      filename,
      url,
      thumbnailName,
      thumbnailUrl,
      date,
      shorts,
      title,
      description,
      JSON.stringify(studentCategory),
      videoCategory,
      videoDuration,
      channelId || null,
      source
    );

    setLiveSessions((prevVal) => {
      const updateVal = [...prevVal];
      updateVal.unshift({
        _id: insertId,
        title: title,
        description: description,
        thumbnail: thumbnailUrl,
        thumbnailFileName: thumbnailName,
        videoUrl: url,
        shorts,
        videoFileName: filename,
        studentCategory: studentCategory,
        videoCategory: videoCategory,
        videoDuration: videoDuration,
        channelId: channelId || null,
        isDownloadable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        videoCreatedAt: date,
      });
      return updateVal;
    });

    // Upload phase complete, now poll for conversion
    setUploadPhaseComplete(true);
    setConversionStarted(true);
    setProgress(50); // 50% for upload completion

    try {
      await pollConversionStatus(insertId, (conversionProgress) => {
        // Conversion progress is 0-100, map to 50-100 for overall progress
        const totalProgress = 50 + (conversionProgress / 2);
        setProgress(Math.round(totalProgress));
      });

      // Conversion completed successfully
      setProgress(100);
      setSuccessModal(true);
      setError(false);
      setMsg("Upload and conversion completed successfully!");
    } catch (conversionError) {
      console.error("Conversion error:", conversionError.message);
      // Conversion failed, but video upload was successful
      // It will fall back to MP4 playback
      setProgress(100);
      setSuccessModal(true);
      setError(false);
      setMsg("Upload completed! Video will play in MP4 format.");
    } finally {
      setBtnLoading(false);
      setCancelTokenSource(null);
    }

    closeModal();
  };

  return (
    <Fragment>
      {showModal && (
        <dialog id="uploader" className="modal" open={showModal}>
          <div className="modal-box rounded-none py-10 bg-primary-content max-w-5xl w-full card-frame">
            {/* close button */}
            <Button
              size="btn-sm"
              variant="btn-ghost"
              className="absolute right-2 top-2"
              iconPosition="left"
              icon={CloseIcon}
              onClick={closeModal}
            />
            <Typography
              tag="h4"
              size="text-3xl"
              weight="font-semibold"
              color="text-base-content"
              className="block text-center mb-2"
            >
              {modalTitle}
            </Typography>
            <Typography
              tag="p"
              size="text-base"
              weight="font-medium"
              color="text-base-200"
              className="block text-center mb-4"
            >
              For best results, video uploads should be at least 1080 (1920x1080
              pixels) in MP4 format.
            </Typography>

            <form>
              <fieldset disabled={btnLoading ? true : false}>
                <Input
                  type="date"
                  className="input-sm max-w-48 w-full"
                  max={getCurrentDateTime().split("T")[0]}
                  error={formik.touched.date && formik.errors.date}
                  {...formik.getFieldProps("date")}
                />

                <div className="grid md:grid-cols-2 grid-cols-1 gap-3 mb-4">
                  <Uploader
                    filename={formik.values.file?.name}
                    title="Browse or drag and drop video files to upload"
                    fileTypes={["MP4", "WEBM"]}
                    multiple={false}
                    onChange={(file) => {
                      if (!file) return;

                      formik.setFieldValue("file", file);

                      if (!file.type.startsWith("video")) return;

                      const videoURL = URL.createObjectURL(file);

                      const videoElement = document.createElement("video");
                      videoElement.preload = "metadata";
                      videoElement.src = videoURL;

                      videoElement.onloadedmetadata = () => {
                        const duration = videoElement.duration;
                        const formattedDuration = secToMin(duration)

                        setVideoDuration(formattedDuration);

                        URL.revokeObjectURL(videoURL);
                      };
                    }}
                    error={formik.touched.file && formik.errors.file}
                  />
                  <video ref={videoRef} hidden width={0} height={0} />
                  <Uploader
                    filename={formik.values.thumbnail.name}
                    title="Browse or drag and drop Thumbnail"
                    fileTypes={["JPG", "JPEG", "PNG", "WEBP"]}
                    name="thumbnail"
                    onChange={(e) => formik.setFieldValue("thumbnail", e)}
                    error={formik.touched.thumbnail && formik.errors.thumbnail}
                  />
                </div>
                <Input
                  type="text"
                  id="title"
                  label="Title*"
                  placeholder="Title"
                  {...formik.getFieldProps("title")}
                  error={formik.touched.title && formik.errors.title}
                />
                <Textarea
                  id="description"
                  label="Description"
                  placeholder="Description"
                  {...formik.getFieldProps("description")}
                  error={
                    formik.touched.description && formik.errors.description
                  }
                />

                {/* <div className="category-checks grid gap-3 md:grid-cols-4 sm:grid-cols-2 grid-cols-1 mb-3">
                  {[{ label: "Shorts", value: "shorts" }].map(
                    (category, index) => (
                      <InputChecks
                        type="checkbox"
                        key={index}
                        name="shorts"
                        id={category.value}
                        value={category.value}
                        label={category.label}
                        checked={formik.values.shorts === true}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          formik.setFieldValue("shorts", isChecked);
                        }}
                      />
                    )
                  )}
                </div> */}

                <Typography
                  tag="p"
                  size="text-sm"
                  weight="font-normal"
                  color="text-base-100"
                  className="mb-3"
                >
                  Category
                </Typography>

                <div className="category-checks grid gap-3 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
                  {[{ label: "All", value: "all" }, ...roleOptions].map(
                    (category, index) => (
                      <InputChecks
                        type="checkbox"
                        key={index}
                        name="studentCategory"
                        id={category.value}
                        value={category.value}
                        label={category.label}
                        checked={formik.values.studentCategory.includes(
                          category.value
                        )}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          const updatedCategories = isChecked
                            ? [...formik.values.studentCategory, category.value]
                            : formik.values.studentCategory.filter(
                                (c) => c !== category.value
                              );
                          formik.setFieldValue(
                            "studentCategory",
                            updatedCategories
                          );
                        }}
                      />
                    )
                  )}
                </div>
                {formik.touched.studentCategory &&
                  formik.errors.studentCategory && (
                    <div className="text-red-600">
                      {formik.errors.studentCategory}
                    </div>
                  )}

                <Typography
                  tag="p"
                  size="text-sm"
                  weight="font-normal"
                  color="text-base-100"
                  className="mb-3 mt-4"
                >
                  Channel
                </Typography>
                <select
                  name="channelId"
                  value={formik.values.channelId}
                  onChange={formik.handleChange}
                  className="select select-bordered w-full max-w-xs mb-4 bg-white text-base-content"
                >
                  <option value="">-- Select a Channel --</option>
                  {channels.map((channel) => (
                    <option key={channel._id} value={channel._id}>
                      {channel.name}
                    </option>
                  ))}
                </select>

                <ProgressBar
                  progress={progress}
                  label={conversionStarted ? "Converting to HLS" : "Uploading video"}
                />
              </fieldset>
              <div className="flex flex-wrap gap-3 mt-8 justify-center	">
                <Button
                  variant="btn-primary"
                  className="btn-sm w-40 "
                  type="submit"
                  onClick={formik.handleSubmit}
                  loading={btnLoading}
                >
                  Upload
                </Button>
                <Button
                  variant="btn-base-300"
                  className="btn-sm w-40"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </dialog>
      )}

      {successModal && (
        <SuccessModal
          showModal={successModal}
          setShowModal={setSuccessModal}
          onClose={() => {
            setSuccessModal(false);
          }}
          error={error}
          modalTitle={msg}
        />
      )}
    </Fragment>
  );
};

export default VideoUploader;
