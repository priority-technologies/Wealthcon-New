import Image from "next/image";
import Button from "../Button";
import Input from "../Input";
import Typography from "../Typography";
import { useState } from "react";
import openEye from "@/assets/images/svg/openEye.svg";
import closeEye from "@/assets/images/svg/closeEye.svg";

export default function CreatePassword({ formik, loading }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
      <Typography
        tag="h1"
        size="text-3xl"
        weight="font-semibold"
        color="text-base-content"
        className="block text-left"
      >
        Create New Password
      </Typography>
      <Typography
        tag="h4"
        size="text-base"
        weight="font-normal"
        color="text-base-200"
        className="block text-left pt-1 mb-4 mt-2"
      >
        Enter your new password below.
      </Typography>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          id="password"
          label="Password"
          name="password"
          placeholder="At least 8 characters"
          error={formik.touched.Password && formik.errors.Password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        <Image
          priority
          src={showPassword ? closeEye : openEye}
          height={26}
          width={26}
          alt="Toggle password visibility"
          className="absolute top-8 right-2 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        />
      </div>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="At least 8 characters"
          error={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.confirmPassword}
        />
        <Image
          priority
          src={showPassword ? closeEye : openEye}
          height={26}
          width={26}
          alt="Toggle password visibility"
          className="absolute top-8 right-2 cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
        />
      </div>
    </>
  );
}
