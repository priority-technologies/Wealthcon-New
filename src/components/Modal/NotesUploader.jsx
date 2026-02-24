"use client";

import { Fragment, useContext, useState } from "react";
import "./modal.scss";
import CloseIcon from "../../assets/images/svg/closeIcon.svg";
import Button from "../Button";
import Uploader from "../Uploader";
import Typography from "../Typography";
import Input from "../Input";
import Textarea from "../Input/Textarea";
import InputChecks from "../Input/InputChecks";
import { useFormik } from "formik";
import * as Yup from "yup";

import axios from "axios";
import {
  completeUploadNotes,
  generateSignUrl,
  uploadVideoThumbnail,
} from "../../util/uploadFile";
import SuccessModal from "./SuccessModal";
import { PDFDocument } from "pdf-lib";
import { UserContext } from "@/app/_context/User";
import { getCurrentDateTime, getFileType } from "@/helpers/all";
import { adminRoles, roleOptions } from "@/helpers/constant";

const NotesUploader = ({ showModal, setShowModal, modalTitle }) => {
  const { setNotes } = useContext(UserContext);

  const [btnLoading, setBtnLoading] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(null);

  const [successModal, setSuccessModal] = useState(false);
  const [error, setError] = useState(false);
  const [msg, setMsg] = useState("");

  const formik = useFormik({
    initialValues: {
      date: "",
      file: "",
      thumbnail: "",
      title: "",
      description: "",
      studentCategory: [],
      pageCount: 0,
      type: null,
    },
    validationSchema: Yup.object({
      date: Yup.date()
        .required("Date is required")
        .nullable()
        .typeError("Invalid date format"),
      file: Yup.mixed().required("Notes file is required"),
      title: Yup.string().required("Title is required").trim(),
      description: Yup.string().required("Description is required").trim(),
      studentCategory: Yup.array()
        .of(Yup.string().oneOf(adminRoles, "Invalid category"))
        .min(1, "At least one category is required"),
    }),
    onSubmit: async (values) => {
      try {
        await handleUploadNotes(values);
      } catch (error) {
        if (axios.isCancel(error)) {
          return;
        }
        if (error.message === "cancel") {
          return;
        }
        setSuccessModal(true);
        setError(true);
        setBtnLoading(false);
        setMsg("An error occurred. Please try again.");
        console.error("Error during submission:", error);
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

  const handleUploadNotes = async (values) => {
    const {
      file,
      thumbnail,
      date,
      title,
      description,
      studentCategory,
      pageCount,
      type
    } = values;

    if (!file) {
      alert("No file selected");
      return;
    }

    setBtnLoading(true);

    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    const ext = file.name.split(".").pop();
    const filename = `notes/${Date.now()}.${ext}`;

    const { url: notesUrl } = await generateSignUrl(file, filename, source);

    let thumbnailUrl = "",
      thumbnailFileName = "";

    if (thumbnail) {
      const thumbnailExt = thumbnail.name.split(".").pop();
      thumbnailFileName = `thumbnails/${Date.now()}.${thumbnailExt}`;
      const thumbnailFiletype = thumbnail.type;

      const response = await uploadVideoThumbnail(
        thumbnail,
        thumbnailFileName,
        thumbnailFiletype,
        source
      );

      thumbnailUrl = response.thumbnailUrl;
    }

    const { insertId } = await completeUploadNotes(
      filename,
      notesUrl,
      thumbnailFileName,
      thumbnailUrl,
      date,
      title,
      description,
      JSON.stringify(studentCategory),
      pageCount,
      type,
      source,
    );

    setNotes((prevVal) => {
      const updateVal = [...prevVal];
      updateVal.unshift({
        _id: insertId,
        title: title,
        description: description,
        thumbnail: thumbnailUrl,
        thumbnailFileName,
        noteUrl: notesUrl,
        noteFileName: filename,
        pageCount,
        studentCategory: studentCategory,
        isDownloadable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        notesCreatedAt: date,
        type
      });
      return updateVal;
    });

    setBtnLoading(false);
    setCancelTokenSource(null);

    setSuccessModal(true);
    setError(false);
    setMsg("Upload successfully!");
    closeModal();
  };

  const handleFileChange = async (file) => {
    if (file) {
      const fileName = file.name;
      const fileType = getFileType(fileName);
      formik.setFieldValue("file", file);
      formik.setFieldValue("type", fileType);
      if (fileType === "pdf") {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const numberOfPages = pdfDoc.getPageCount();
          formik.setFieldValue("pageCount", numberOfPages);
        } catch (err) {
          setPageCount(0);
        }
      }
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
            ></Button>
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
              There are many variations of passages of Lorem Ipsum available.
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
                    title="Drag and drop files to upload"
                    fileTypes={[
                      "PDF",
                      "XLS",
                      "XLSX",
                      "PNG",
                      "JPG",
                      "JPEG",
                      "DOC",
                      "DOCX",
                    ]}
                    multiple={false}
                    classes="max-w-full"
                    onChange={handleFileChange}
                    error={formik.touched.file && formik.errors.file}
                  />
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
              </fieldset>
              <div className="flex flex-wrap gap-3 mt-8 justify-center	">
                <Button
                  variant="btn-primary"
                  className="btn-sm w-40"
                  type="submit"
                  onClick={formik.handleSubmit}
                  loading={btnLoading}
                >
                  Save
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

export default NotesUploader;
