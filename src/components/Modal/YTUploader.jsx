"use client";

import { Fragment, useContext, useEffect, useRef, useState } from "react";
import "./modal.scss";
import CloseIcon from "../../assets/images/svg/closeIcon.svg";
import Button from "../Button";
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
} from "../../util/uploadFile";

import axios from "axios";
import SuccessModal from "./SuccessModal";
import { UserContext } from "../../app/_context/User";
import { getCurrentDateTime } from "@/helpers/all";
import { adminRoles } from "@/helpers/constant";

const YTUploader = ({ showModal, setShowModal, modalTitle }) => {
  const videoRef = useRef(null);
  const { setLiveSessions } = useContext(UserContext);

  const [progress, setProgress] = useState(0);
  const [btnLoading, setBtnLoading] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(null);
  const [successModal, setSuccessModal] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");

  const formik = useFormik({
    initialValues: {
      date: "",
      yturl: "",
      title: "",
      shorts: false,
      description: "",
      studentCategory: [],
      videoCategory: "",
      duration: 0,
    },
    validationSchema: Yup.object({
      date: Yup.date()
        .required("Date is required")
        .nullable()
        .typeError("Invalid date format"),
      yturl: Yup.string()
        .required("Video file URL is required"),
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
      }finally{
        setProgress(0);
      }
    },
  });

  const handleUploadVideo = async (values) => {
    const { yturl, date, title, shorts, description, studentCategory, videoCategory } = values;
  
    setBtnLoading(true);
  
    try {
      const response = await axios.post("/api/admin/yt_video", {
        yturl,
        date,
        title,
        shorts,
        description,
        studentCategory,
        videoCategory,
      });
  
      if (response.data.success) {
        setSuccessModal(true);
        setError(false);
        setMsg("Video uploaded successfully!");
        closeModal();
      } else {
        // Handle failure
        setSuccessModal(true);
        setError(true);
        setMsg(response.data.message || "Failed to upload video.");
      }
    } catch (error) {
      console.error("Error uploading video:", error);
      setSuccessModal(true);
      setError(true);
      setMsg("An error occurred. Please try again.");
    } finally {
      setBtnLoading(false);
      setProgress(0);
    }
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

  useEffect(() => {
    if (successModal && !error) {
      const fetchLiveSessions = async () => {
        try {
          const response = await axios.get("/api/admin/live_sessions");
          setLiveSessions(response.data.sessions);
        } catch (error) {
          console.error("Error fetching live sessions:", error);
        }
      };
      fetchLiveSessions();
    }
  }, [successModal, error, setLiveSessions]);

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

                <Input
                  type="url"
                  id="yturl"
                  label="Youtube URL*"
                  placeholder="Youtube URL"
                  {...formik.getFieldProps("yturl")}
                  error={formik.touched.yturl && formik.errors.yturl}
                />
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
                  {[
                    { label: "Graduate", value: "graduate" },
                    { label: "Guide", value: "guide" }
                  ].map((category, index) => (
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

export default YTUploader;
