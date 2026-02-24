"use client";

import { Fragment, useContext, useRef, useState } from "react";
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
  carryAndIncrementV,
  completeUploadVideo,
  initiateUpload,
  uploadPart,
  uploadVideoThumbnail,
} from "@/util/uploadFile";

import axios from "axios";
import SuccessModal from "./SuccessModal";
import { UserContext } from "../../app/_context/User";
import { getCurrentDateTime } from "@/helpers/all";
import { useRouter } from "next/navigation";
import { adminRoles, roleOptions } from "@/helpers/constant";

const VideoEdit = ({ id, showModal, setShowModal, modalTitle, item }) => {
  const router = useRouter();
  const videoRef = useRef(null);
  const { setLiveSessions } = useContext(UserContext);

  const [progress, setProgress] = useState(0);
  const [btnLoading, setBtnLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");
  const [cancelTokenSource, setCancelTokenSource] = useState(null);

  const formik = useFormik({
    initialValues: {
      date: item.videoCreatedAt?.split("T")[0] || "",
      file: {
        name: item.videoFileName || "",
        url: item.videoUrl || "",
      },
      thumbnail: {
        name: item.thumbnailFileName || "",
        url: item.thumbnail || "",
      },
      title: item.title,
      description: item.description,
      studentCategory: item.studentCategory,
      videoCategory: item.videoCategory,
      duration: item.duration || 0,
    },
    validationSchema: Yup.object({
      date: Yup.date()
        .required("Date is required")
        .nullable()
        .typeError("Invalid date format"),
      file: Yup.mixed().required("Video file is required"),
      title: Yup.string()
        .required("Title is required")
        .trim(),
      description: Yup.string()
        .required("Description is required")
        .trim(),
      studentCategory: Yup.array()
        .of(
          Yup.string().oneOf(
            adminRoles,
            "Invalid category"
          )
        )
        .min(1, "At least one category is required"),
      videoCategory: Yup.string()
        .required("Video category is required")
        .oneOf(["live", "assignment"], "Invalid video category"),
    }),
    onSubmit: async (values) => {
      try {
        setBtnLoading(true);
        await handleEditData(values);
      } catch (error) {
        setBtnLoading(false);
        setProgress(0);
        if (axios.isCancel(error) || error.message === "cancel") {
          return;
        }
        if (error?.response?.status === 401) {
          return router.push("/login");
        }
        setSuccessModal(true);
        setError(true);
        setMsg("An error occurred. Please try again.");
        console.error("Error during submission:", error);
      }
    },
  });

  const handleEditData = async (values) => {
    const {
      file,
      thumbnail,
      date,
      title,
      description,
      studentCategory,
      videoCategory,
      duration,
    } = values;

    setBtnLoading(true);

    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    let filename = file.name,
      uploadId = "",
      url = file.url;

    const parts = [];

    if (file && file?.size) {
      const ext = file.name.split(".").pop();
      const name = item.videoFileName.split(".").shift();
      filename = `${name}.${ext}`;
      const filetype = file.type;

      setProgress(1);
      uploadId = await initiateUpload(filename, filetype, source);

      setProgress(5);

      const this500MB = 524288000;
      let chunkMb = 10;
      if (file.size > this500MB) {
        chunkMb = 50;
      }

      const CHUNK_SIZE = chunkMb * 1024 * 1024;
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

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
    }

    let thumbnailName = thumbnail.name,
      thumbnailUrl = thumbnail.url;

    if (thumbnail && thumbnail?.size) {
      const thumbnailExt = thumbnail.name.split(".").pop();
      const name = item?.thumbnailFileName?.split(".").shift() || "";
      thumbnailName = name
        ? `${name}.${thumbnailExt}`
        : `thumbnails/${Date.now()}.${thumbnailExt}`;
      const thumbnailFiletype = thumbnail.type;

      const response = await uploadVideoThumbnail(
        thumbnail,
        thumbnailName,
        thumbnailFiletype,
        source
      );

      thumbnailName = await carryAndIncrementV(item.thumbnailFileName, thumbnailName)
      thumbnailUrl = response.thumbnailUrl;
    }
    setProgress(93);

    if (file && file?.size) {
      const response = await completeUploadVideo(
        filename,
        uploadId,
        parts,
        source
      );
      filename = await carryAndIncrementV(item.videoFileName, filename)
      url = response.url;
    }
    setProgress(97);

    const response = await axios.put(
      `/api/admin/videos/${item._id}`,
      {
        filename,
        videoUrl: url,
        thumbnailName,
        thumbnailUrl,
        date,
        title,
        description,
        studentCategory: JSON.stringify(studentCategory),
        videoCategory,
        duration,
      },
      { cancelToken: source.token }
    );

    setLiveSessions((prevVal) => {
      const updateVal = [...prevVal];
      const editIndex = updateVal.findIndex((e) => e._id === item._id);

      if (editIndex !== -1) {
        updateVal[editIndex] = {
          ...updateVal[editIndex],
          title: title,
          description: description,
          thumbnail: thumbnailUrl,
          thumbnailFileName: thumbnailName,
          videoUrl: url,
          videoFileName: filename,
          studentCategory: studentCategory,
          videoCategory: videoCategory,
          videoDuration: duration,
          videoCreatedAt: date,
        };
      }

      return updateVal;
    });

    setProgress(100);
    setSuccessModal(true);
    setError(false);
    setMsg(response.data.message || "Update successfully!");
    setBtnLoading(false);
    // closeModal();
  };

  const closeModal = () => {
    formik.resetForm();
    setShowModal(false);
    setBtnLoading(false);

    if (cancelTokenSource) {
      cancelTokenSource.cancel("Upload canceled by user");
      setCancelTokenSource(null);
    }
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
                    fileTypes={["Mp4", "WEBM"]}
                    multiple={false}
                    onChange={(file) => {
                      formik.setFieldValue("file", file);
                      if (!file.type.startsWith("video")) return;
                      const videoURL = URL.createObjectURL(file);

                      const onLoadedMetadata = () => {
                        const { duration } = videoRef.current;
                        const minutes = Math.floor(duration / 60);
                        const seconds = Math.floor(duration % 60);
                        const formattedDuration = `${minutes}.${
                          seconds < 10 ? "0" : ""
                        }${seconds}`;
                        formik.setFieldValue(
                          "duration",
                          Number(formattedDuration)
                        );
                        URL.revokeObjectURL(videoURL);
                      };

                      videoRef.current.src = videoURL;
                      videoRef.current.addEventListener(
                        "loadedmetadata",
                        onLoadedMetadata,
                        { once: true }
                      );
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
                  {...formik.getFieldProps("title")}
                  error={formik.touched.title && formik.errors.title}
                />
                <Textarea
                  id="description"
                  label="Description"
                  {...formik.getFieldProps("description")}
                  error={
                    formik.touched.description && formik.errors.description
                  }
                />

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
                  {[{ label: "All", value: "all" }, ...roleOptions].map((category, index) => (
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
                  ))}
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
                  Video Category
                </Typography>
                <div className="category-checks grid gap-3 md:grid-cols-4 sm:grid-cols-2 grid-cols-1">
                  {["Live", "Assignment"].map((category) => (
                    <InputChecks
                      type="radio"
                      key={category}
                      name="videoCategory"
                      id={category}
                      value={category.toLowerCase()}
                      label={category}
                      checked={
                        formik.values.videoCategory === category.toLowerCase()
                      }
                      onChange={(e) =>
                        formik.setFieldValue("videoCategory", e.target.value)
                      }
                      error={
                        formik.touched.videoCategory &&
                        formik.errors.videoCategory
                      }
                    />
                  ))}
                </div>
                {formik.touched.videoCategory &&
                  formik.errors.videoCategory && (
                    <div className="text-red-600">
                      {formik.touched.videoCategory &&
                        formik.errors.videoCategory}
                    </div>
                  )}

                <ProgressBar progress={progress} />
              </fieldset>
              <div className="flex flex-wrap gap-3 mt-8 justify-center	">
                <Button
                  variant="btn-primary"
                  className="btn-sm w-40 "
                  type="submit"
                  // onClick={handleUploadVideo}
                  onClick={formik.handleSubmit}
                  loading={btnLoading}
                >
                  Update
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
            if (!error) {
              closeModal();
            }
            setSuccessModal(false);
          }}
          error={error}
          modalTitle={msg}
        />
      )}
    </Fragment>
  );
};

export default VideoEdit;
