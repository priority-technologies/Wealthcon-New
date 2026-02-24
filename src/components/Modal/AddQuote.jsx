"use client";

import { Fragment, useContext, useState } from "react";
import "./modal.scss";
import CloseIcon from "../../assets/images/svg/closeIcon.svg";
import Button from "../Button";
import Typography from "../Typography";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { UserContext } from "../../app/_context/User";
import { useRouter } from "next/navigation";
import { generateSignUrl } from "@/util/uploadFile";
import Image from "next/image";
import Uploader from "../Uploader";

const AddQuote = ({ showModal, setShowModal }) => {
  const router = useRouter();
  const { gallery, setGallery } = useContext(UserContext);
  const [btnLoading, setBtnLoading] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(null);

  const formik = useFormik({
    initialValues: {
      quote: "",
      image: null,
    },
    validationSchema: Yup.object({
      // quote: Yup.string().required("Quote is required").trim(),
      image: Yup.mixed().required("Image is required"),
    }),
    onSubmit: async (values) => {
      try {
        await handleSendQuote(values);
      } catch (error) {
        if (axios.isCancel(error) || error.message === "cancel") {
          return;
        }
        if (error?.response?.status === 401) {
          return router.push("/login");
        }
        setBtnLoading(false);
        console.error("Error during submission:", error);
      }
    },
  });

  const handleSendQuote = async (values) => {
    const { image } = values;
    setBtnLoading(true);
    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    const ext = image.name.split(".").pop();
    const filename = `quote/${Date.now()}.${ext}`;

    const { url } = await generateSignUrl(image, filename, source);

    const res = await axios.post(
      "/api/admin/upload/quote",
      { url, filename },
      {
        headers: {
          "Content-Type": image.type,
        },
        cancelToken: source.token,
      }
    );

    const { insertId } = res.data;

    setGallery((prevVal) => {
      const updatedVal = [...prevVal];
      updatedVal.unshift({
        _id: insertId,
        image: URL.createObjectURL(image),
        createdAt: new Date(),
      });
      return updatedVal;
    });

    closeModal();
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
            {/* Close button */}
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
              New Quote
            </Typography>
            <Typography
              tag="p"
              size="text-base"
              weight="font-medium"
              color="text-base-200"
              className="block text-center mb-4"
            >
              Add a memorable quote with an image.
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <fieldset disabled={btnLoading ? true : false}>
                <div className="grid grid-cols-1 gap-3 mb-4">
                  <Uploader
                    label="Quote Image"
                    filename={formik.values.file?.name}
                    title="Browse or drag and drop video files to upload"
                    fileTypes={["jpg","jpeg","png","gif"]}
                    classes="max-w-full"
                    multiple={false}
                    accept="image/*"
                    onChange={(event) => formik.setFieldValue("image", event)}
                    error={formik.touched.image && formik.errors.image}
                  />
                </div>

                {/* {formik.values.image && (
                  <Image
                    src={URL.createObjectURL(formik.values.image)}
                    alt="Selected"
                    className="mt-4"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                    width={200}
                    height={200}
                  />
                )} */}
              </fieldset>
              <div className="flex flex-wrap gap-3 mt-8 justify-center">
                <Button
                  variant="btn-primary"
                  className="btn-sm w-40"
                  type="submit"
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
    </Fragment>
  );
};

export default AddQuote;
