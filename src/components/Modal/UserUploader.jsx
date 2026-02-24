"use client";

import { Fragment, useState } from "react";
import "./modal.scss";
import CloseIcon from "../../assets/images/svg/closeIcon.svg";
import Button from "../Button";
import UploaderUser from "../Uploader/UploaderUser";
import Typography from "../Typography";
import axios from "axios";
import Select from "../Input/Select";
import Input from "../Input";
import { useFormik } from "formik";
import * as Yup from "yup";
import openEye from "../../assets/images/svg/openEye.svg";
import closeEye from "../../assets/images/svg/closeEye.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { roleOptions, roles } from "@/helpers/constant";

const UserUploader = ({ id, showModal, setShowModal, fetchUsers }) => {
  const router = useRouter();
  const [fileData, setFileData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fieldsDisable, setFieldsDisable] = useState(false);
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      role: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
      email: "",
      district: "",
      state: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .required("Name is required")
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(100, "Name cannot exceed 100 characters"),
      role: Yup.string()
        .required("Role is required")
        .oneOf(roles, "Invalid role"),
      mobileNumber: Yup.string()
        .required("Mobile number is required")
        .matches(/^[0-9]{5,15}$/, "Mobile number is not valid"),
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 6 characters"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      district: Yup.string().required("District is required").trim(),
      state: Yup.string().required("State is required").trim(),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        const fullName = values?.fullName;

        const user = {
          username: fullName,
          email: values?.email,
          password: values?.password,
          role: values?.role || "lot15",
          mobile: values?.mobileNumber,
          district: values?.district,
          state: values?.state,
          isActive: true,
        };

        await axios
          .post(`/api/admin/users/new`, { user })
          .then((res) => {
            alert("User uploaded successfully");
            fetchUsers();
            closeModal();
          })
          .finally(() => setLoading(false));
      } catch (error) {
        if (error?.response?.status === 401) {
          return router.push("/login");
        }
        setError(true);
        setMsg("An error occurred. Please try again.");
        const message =
          error?.response?.data?.error ||
          "An error occurred. Please try again.";
        alert(message);
        console.error("Error during submission:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  const closeModal = () => {
    setShowModal(false);
    setFieldsDisable(false);
    formik.resetForm({
      values: {
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobileNumber: "",
        role: "",
        district: "",
        state: "",
      },
      errors: {}, // Reset errors
      touched: {}, // Reset touched
    });
  };

  const handleDataParsed = (data) => {
    if (data?.length) {
      setFieldsDisable(true);
      formik.resetForm({
        values: {
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          mobileNumber: "",
          role: "",
          district: "",
          state: "",
        },
        errors: {}, // Reset errors
        touched: {}, // Reset touched
      });
    }
    setFileData(data);
  };

  const handleUpload = async () => {
    let isValid = true;
    for (let i = 0; i < fileData.length; i++) {
      const row = fileData[i];
      try {
        if (!row["email"]) {
          throw new Error("Email is missing or empty.");
        }
        if (!row["username"]) {
          throw new Error(`${row.email} Full name is missing or empty.`);
        }
        if (!row["mobile"]) {
          throw new Error(`${row.email} Mobile number is missing or empty.`);
        }
        if (!row["role"]) {
          throw new Error(`${row.email} Role is missing or empty.`);
        }
      } catch (error) {
        alert(`Error processing row ${i + 1}: ${error.message}`);
        isValid = false;
        break;
      }
    }

    if (isValid && fileData.length > 0) {
      try {
        setLoading(true);
        await axios
          .post("/api/admin/upload/users", { users: fileData })
          .then((res) => {
            alert("Users uploaded successfully");
            fetchUsers();
            closeModal();
          })
          .finally(() => setLoading(false));
      } catch (error) {
        if (error?.response?.status === 401) {
          return router.push("/login");
        }
        console.error(error);
        alert(error?.response?.data?.error || "Failed to upload users");
      }
    } else {
      formik.handleSubmit();
    }
  };

  return (
    <>
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
            />
            <Typography
              tag="h4"
              size="text-3xl"
              weight="font-semibold"
              color="text-base-content"
              className="block text-center mb-2"
            >
              Add User Details
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
            <div className="grid grid-cols-1 gap-3 mb-4">
              <UploaderUser
                title="Drag and drop .CSV files to upload"
                fileTypes={["csv"]}
                multiple={true}
                classes="max-w-full"
                onDataParsed={handleDataParsed}
              />
            </div>
            {!fieldsDisable && (
              <>
                <div className="text-center mt-4 mb-4 text-xl">
                  <b>- Or - </b>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="text"
                    id="fullName"
                    label="Full Name"
                    className="capitalize"
                    disabled={fieldsDisable}
                    {...formik.getFieldProps("fullName")}
                    error={formik.touched.fullName && formik.errors.fullName}
                  />
                  <div>
                    <Typography
                      tag="p"
                      size="text-sm"
                      weight="font-normal"
                      color="text-base-100"
                      className="mb-1"
                    >
                      Category
                    </Typography>
                    <Select
                      label="Category"
                      options={roleOptions}
                      disabled={fieldsDisable}
                      {...formik.getFieldProps("role")}
                      error={formik.touched.role && formik.errors.role}
                      className="modelSelect"
                    />
                    {formik.touched.role && formik.errors.role ? (
                      <span className="text-red-600">Category is required</span>
                    ) : (
                      ""
                    )}
                  </div>
                  <Input
                    type="number"
                    id="mobileNumber"
                    label="Mobile Number"
                    pattern="[0-9]{5,15}"
                    disabled={fieldsDisable}
                    {...formik.getFieldProps("mobileNumber")}
                    error={
                      formik.touched.mobileNumber && formik.errors.mobileNumber
                    }
                  />
                  <Input
                    type="email"
                    id="email"
                    label="Email"
                    disabled={fieldsDisable}
                    {...formik.getFieldProps("email")}
                    error={formik.touched.email && formik.errors.email}
                  />
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      label="Password"
                      disabled={fieldsDisable}
                      {...formik.getFieldProps("password")}
                      error={formik.touched.password && formik.errors.password}
                    />
                    {
                      <Image
                        priority
                        src={showPassword ? closeEye : openEye}
                        height={26}
                        width={26}
                        alt="Password seen eye"
                        className="absolute top-8 right-2 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    }
                  </div>
                  <Input
                    type="password"
                    id="confirmPassword"
                    label="Confirm Password"
                    disabled={fieldsDisable}
                    {...formik.getFieldProps("confirmPassword")}
                    error={
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                    }
                  />
                  <Input
                    type="text"
                    id="district"
                    label="District"
                    disabled={fieldsDisable}
                    {...formik.getFieldProps("district")}
                    error={formik.touched.district && formik.errors.district}
                  />
                  <Input
                    type="text"
                    id="state"
                    label="State"
                    disabled={fieldsDisable}
                    {...formik.getFieldProps("state")}
                    error={formik.touched.state && formik.errors.state}
                  />
                </div>
              </>
            )}
            <div className="flex flex-wrap gap-3 mt-8 justify-center">
              <Button
                variant="btn-primary"
                className="btn-sm w-40"
                onClick={handleUpload}
                loading={loading}
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
          </div>
        </dialog>
      )}
    </>
  );
};

export default UserUploader;
