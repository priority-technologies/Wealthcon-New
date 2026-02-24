"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import Button from "../../../components/Button";
import Image from "next/image";
import AuthLogo from '../../../assets/images/AuthLogo.png';
import BackPage from "../../../assets/images/svg/backPage.svg";
import '../AuthLayout.scss';
import { usePathname, useRouter } from "next/navigation";
import EmailVerify from "@/components/ForgotPassword/EmailVerify";
import OTPVerify from "@/components/ForgotPassword/OTPVerify";
import CreatePassword from "@/components/ForgotPassword/CreatePassword";
import axios from "axios";
import Link from "next/link";
import Typography from "@/components/Typography";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const pathname = usePathname();

  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const validationSchemas = {
    1: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    2: Yup.object({
      otp: Yup.array()
        .of(
          Yup.string()
            .required("OTP is required")
            .length(1, "Each OTP digit must be a single character")
        )
        .length(5, "OTP must be exactly 5 digits")
        .test(
          "otp",
          "OTP must be exactly 5 digits and contain only numbers",
          (otp) => {
            return otp.length === 5 && otp.every((digit) => /^\d$/.test(digit));
          }
        ),
    }),
    3: Yup.object({
      password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
  };

  const validationSchema = validationSchemas[step];

  const handleSendOTP = async (email) => {
    await axios.post("/api/auth/generate-otp", { email });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: Array(5).fill(""),
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const { email, otp, password, confirmPassword } = values;

      setLoading(true);
      setError(null);

      try {
        if (step === 1) {
          await handleSendOTP(email);
          formik.setFieldValue("otp", Array(5).fill(""));
          formik.setFieldValue("password", "");
          formik.setFieldValue("confirmPassword", "");
          setStep(2);
        } else if (step === 2) {
          const newOtp = otp.join("");
          await axios.post("/api/auth/verify-otp", { email, otp: newOtp });
          formik.setFieldValue("password", "");
          formik.setFieldValue("confirmPassword", "");
          setStep(3);
        } else if (step === 3) {
          await axios.put("/api/auth/reset-password", {
            email,
            password,
            confirmPassword,
          });
          formik.resetForm();
          router.push("/login");
        }
      } catch (err) {
        setError(err.response?.data?.error || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleBack = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
    setError(null);
  };

  if (pathname !== "/login" && pathname !== "/forgot-password") {
    router.push("/login");
    return;
  }

  const handleChange = (e) => {
    setError(null);
    formik.handleChange(e);
  };

  return (
    <div className="md:grid block grid-cols-10">
      <div className="login-sidebar md:h-screen md:py-0 py-10 xl:col-span-6 col-span-5 ">
        <Image src={AuthLogo} alt='logo' className='m-auto md:w-96 w-60 auth-layout-logo' />
      </div>
      <div className="bg-primary-content md:h-screen content-center block md:py-0 py-10 xl:col-span-4 col-span-5">
        {step > 1 && (
          <Button
            icon={BackPage}
            iconPosition="left"
            className="bg-transparent text-blue-700 hover:bg-transparent font-semibold py-2 px-4 border-none btn-sm"
            onClick={handleBack}
          />
        )}
        <div className="m-auto sm:w-96 px-4">
          <form onSubmit={formik.handleSubmit}>
            {step === 1 && <EmailVerify formik={{ ...formik, handleChange }} />}

            {step === 2 && (
              <OTPVerify
                formik={{ ...formik, handleChange }}
                setError={setError}
                handleSendOTP={handleSendOTP}
              />
            )}

            {step === 3 && (
              <CreatePassword formik={{ ...formik, handleChange }} />
            )}
            {error && <div className="text-red-600">{error}</div>}
        
            <Button
              type="submit"
              variant="btn-primary"
              className="mt-5 px-7 w-full"
              loading={loading}
            >
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
