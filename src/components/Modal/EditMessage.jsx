"use client";

import { Fragment, useContext, useState, useEffect } from "react";
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
import { UserContext } from "../../app/_context/User";
import { useRouter } from "next/navigation";
import { adminRoles, roleOptions } from "@/helpers/constant";

const EditMessage = ({ showModal, setShowModal, message, type }) => {
  const router = useRouter();
  const { userDetails, setMessages, setAnnouncements } =
    useContext(UserContext);
  const [btnLoading, setBtnLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      message: message.message || "",
      messageID: message._id,
      studentCategory: message.studentCategory || [],
    },
    validationSchema: Yup.object({
      message: Yup.string().required("Message is required").trim(),
      studentCategory: Yup.array()
        .of(
          Yup.string().oneOf(
            adminRoles,
            "Invalid category"
          )
        )
        .min(1, "At least one category is required"),
    }),
    onSubmit: async (values) => {
      try {
        await handleEditMessage(values);
      } catch (error) {
        if (error?.response?.status === 401) {
          return router.push("/login");
        }
        console.error("Error during submission:", error);
        setBtnLoading(false);
      }
    },
  });

  const handleEditMessage = async (values) => {
    const { messageID, message, studentCategory } = values;
    setBtnLoading(true);
    try {
      const res = await axios.put(
        type === "Message"
          ? `/api/admin/messages/${messageID}`
          : `/api/admin/announcements/${messageID}`,
        {
          message,
          studentCategory: JSON.stringify(studentCategory),
        }
      );
      const updatedMessage = res.data.updatedMessage;
      if (type === "Message") {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageID
              ? {
                  ...msg,
                  message: updatedMessage.message,
                  studentCategory: updatedMessage.studentCategory,
                  updatedAt: updatedMessage.updatedAt,
                }
              : msg
          )
        );
      } else {
        setAnnouncements((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === messageID
              ? {
                  ...msg,
                  message: updatedMessage.message,
                  studentCategory: updatedMessage.studentCategory,
                  updatedAt: updatedMessage.updatedAt,
                }
              : msg
          )
        );
      }
      setBtnLoading(false);
      closeModal();
    } catch (error) {
      console.error("Error updating message:", error);
      setBtnLoading(false);
    }
  };

  const closeModal = () => {
    formik.resetForm();
    setShowModal(false);
  };

  return (
    <Fragment>
      {showModal && (
        <dialog id="uploader" className="modal" open={showModal}>
          <div className="modal-box rounded-none py-10 bg-primary-content max-w-5xl w-full card-frame">
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
              Edit Message
            </Typography>
            <Typography
              tag="p"
              size="text-base"
              weight="font-medium"
              color="text-base-200"
              className="block text-center mb-4"
            >
              Modify the details of the message below.
            </Typography>

            <form>
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

              <div className="flex flex-wrap gap-3 mt-8 justify-center">
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

export default EditMessage;
