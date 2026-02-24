"use client";

import { Fragment, useContext, useState } from "react";
import "./modal.scss";
import CloseIcon from "../../assets/images/svg/closeIcon.svg";
import Button from "../Button";
import Typography from "../Typography";
import Input from "../Input";
import Textarea from "../Input/Textarea";
import InputChecks from "../Input/InputChecks";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { UserContext } from "../../app/_context/User";
import { getCurrentDateTime } from "@/helpers/all";
import { useRouter } from "next/navigation";

const AddAnnouncement = ({ showModal, setShowModal }) => {
  const router = useRouter();
  const { userDetails, setAnnouncements } = useContext(UserContext);
  const [btnLoading, setBtnLoading] = useState(false);
  const [cancelTokenSource, setCancelTokenSource] = useState(null);

  const formik = useFormik({
    initialValues: {
      datetime: "2024-10-25T13:53",
      message: "",
      studentCategory: [],
    },
    validationSchema: Yup.object({
      datetime: Yup.date()
        .required("Date and time is required")
        .nullable()
        .typeError("Invalid date format"),
      message: Yup.string().required("Message is required").trim(),
      studentCategory: Yup.array()
        .of(
          Yup.string().oneOf(
            [
              "all",
              "lot1",
              "lot2",
              "lot3",
              "lot4",
              "lot5",
              "lot6",
              "lot7",
              "lot8",
              "lot9",
              "lot10",
              "lot11",
              "lot12",
              "lot13",
              "lot14",
              "lot15",
            ],
            "Invalid category"
          )
        )
        .min(1, "At least one category is required"),
    }),
    onSubmit: async (values) => {
      try {
        await handleSendAnnouncement(values);
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

  const handleSendAnnouncement = async (values) => {
    const { message, studentCategory, datetime } = values;
    setBtnLoading(true);
    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    const dateObject = new Date(datetime);
    const gmtDate = dateObject.toISOString();

    const res = await axios.post(
      "/api/admin/announcements",
      {
        message,
        studentCategory: JSON.stringify(studentCategory),
        datetime: gmtDate,
      },
      { cancelToken: source.token }
    );
    const { insertId } = res.data;

    setAnnouncements((presVal) => {
      const updateVal = [...presVal];
      updateVal.unshift({
        ...presVal,
        _id: insertId,
        sender: userDetails._id,
        message,
        studentCategory,
        datetime,
        createdAt: new Date(),
      });
      return updateVal;
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
              New Announcement
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
                {/* <Input
                  type="datetime-local"
                  className="input-sm max-w-48 w-full"
                  label="End date"
                  min={getCurrentDateTime()}
                  error={formik.touched.datetime && formik.errors.datetime}
                  {...formik.getFieldProps("datetime")}
                /> */}
                <Textarea
                  id="description"
                  label="Message"
                  placeholder="Message"
                  error={formik.touched.message && formik.errors.message}
                  {...formik.getFieldProps("message")}
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
                  {[
                    { label: "All", value: "all" },
                    { label: "Lot 1", value: "lot1" },
                    { label: "Lot 2", value: "lot2" },
                    { label: "Lot 3", value: "lot3" },
                    { label: "Lot 4", value: "lot4" },
                    { label: "Lot 5", value: "lot5" },
                    { label: "Lot 6", value: "lot6" },
                    { label: "Lot 7", value: "lot7" },
                    { label: "Lot 8", value: "lot8" },
                    { label: "Lot 9", value: "lot9" },
                    { label: "Lot 10", value: "lot10" },
                    { label: "Lot 11", value: "lot11" },
                    { label: "Lot 12", value: "lot12" },
                    { label: "Lot 13", value: "lot13" },
                    { label: "Lot 14", value: "lot14" },
                    { label: "Lot 15", value: "lot15" },
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
              </fieldset>
              <div className="flex flex-wrap gap-3 mt-8 justify-center	">
                <Button
                  variant="btn-primary"
                  className="btn-sm w-40 "
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
    </Fragment>
  );
};

export default AddAnnouncement;
