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
import { UserContext } from "../../app/_context/User";
import { getCurrentDateTime } from "@/helpers/all";
import { useRouter } from "next/navigation";
import { adminRoles } from "@/helpers/constant";

const AddMessage = ({ showModal, setShowModal }) => {
  const router = useRouter();
  const { userDetails, setMessages } = useContext(UserContext);
  const [btnLoading, setBtnLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      message: "",
      studentCategory: [],
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
        await handleSendMessage(values);
      } catch (error) {
        if (error?.response?.status === 401) {
          return router.push("/login");
        }
        setSuccessModal(true);
        setError(true);
        setBtnLoading(false);
        setMsg("An error occurred. Please try again.");
        console.error("Error during submission:", error);
      }
    },
  });

  const handleSendMessage = async (values) => {
    const { message, studentCategory } = values;
    setBtnLoading(true);
    const res = await axios.post("/api/admin/messages", {
      message,
      studentCategory: JSON.stringify(studentCategory),
    });
    const { insertId } = res.data;
    setMessages((presVal) => {
      const updateVal = [...presVal];
      updateVal.unshift({
        _id: insertId,
        sender: userDetails._id,
        message,
        studentCategory,
        createdAt: new Date(),
      });
      return updateVal;
    });

    setBtnLoading(false);
    closeModal();
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
              Send Message
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
              <Textarea
                id="description"
                label="Message"
                placeholder="Message"
                max={getCurrentDateTime().split("T")[0]}
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

export default AddMessage;
