"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext, useEffect, useState } from "react";
import Button from "../../../components/Button";
import InputChecks from "../../../components/Input/InputChecks";
import Input from "../../../components/Input/Input";
import Typography from "../../../components/Typography";
import Image from "next/image";
import AuthLogo from "../../../assets/images/AuthLogo.png";
import openEye from "../../../assets/images/svg/openEye.svg";
import closeEye from "../../../assets/images/svg/closeEye.svg";
import CloseIcon from "../../../assets/images/svg/closeIcon.svg";
import BImage from "../../../assets/images/docters.jpg";
import axios from "axios";

import "../AuthLayout.scss";
import { usePathname, useRouter } from "next/navigation";
import { UserContext } from "../../_context/User";
import Link from "next/link";

export default function LoginForm() {
  const { setUserDetails, setLiveSessions, setNotes, setGallery, setMessages } =
    useContext(UserContext);
  const router = useRouter();
  const pathname = usePathname();

  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [bgImage, setBgImage] = useState("");

  useEffect(() => {
    const fetchBgImage = async () => {
      try {
        const response = await axios.get(`/api/bg-images`);
        if (response?.data) {
          setBgImage(response.data);
        } else {
          setBgImage(BImage);
        }
      } catch (error) {
        console.error("Failed to load background image", error);
        setBgImage("");
      }
    };
    fetchBgImage();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      remember: Yup.boolean().oneOf(
        [true],
        "You must accept the terms and conditions"
      ),
    }),
    onSubmit: async (values) => {
      setError(null);
      setLoading(true);

      try {
        const response = await axios.post("/api/auth/login", {
          email: values.email,
          password: values.password,
        });

        const data = response?.data;
        if (response.status === 200) {
          const redirectPath =
            data?.role === "admin" || data?.role === "superAdmin"
              ? "/admin"
              : "/home";

          router.push(redirectPath);
        } else {
          setError(data?.error ?? "Login failed");
        }
      } catch (error) {
        if (error?.response?.status === 500) {
          setError("An error occurred. Please try again.");
          setLoading(false);
          return;
        }
        setError(error.response.data.error || "Something went wrong");
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    setUserDetails(null);
    setLiveSessions(null);
    setNotes(null);
    setGallery(null);
    setMessages(null);
  }, [setUserDetails, setLiveSessions, setNotes, setGallery, setMessages]);

  if (pathname !== "/login") {
    router.push("/login");
    return;
  }

  const showTermsModal = () => {
    setShowTerms(true);
  };

  const hideTermsModal = () => {
    setShowTerms(false);
  };

  return (
    <>
      <div className="md:grid block grid-cols-10 h-screen">
        <div className="login-sidebar flex flex-col justify-center xl:col-span-6 col-span-5">
          <div className="flex min-h-[25vh] h-full">
            <Image src={AuthLogo} alt="logo" className="m-auto md:w-96 w-60" />
          </div>
          <img src={bgImage} alt="logo" className="h-[75vh]" />
        </div>
        <div className="bg-primary-content content-center block md:py-0 py-10 xl:col-span-4 col-span-5">
          <div className="m-auto sm:w-96 px-4">
            <form onSubmit={formik.handleSubmit}>
              <Typography
                tag="h1"
                size="text-3xl"
                weight="font-semibold"
                color="text-base-content"
                className="block text-left"
              >
                Welcome 👋
              </Typography>
              <Typography
                tag="h4"
                size="text-base"
                weight="font-normal"
                color="text-base-200"
                className="block text-left pt-1 mb-4 mt-2"
              >
                Today is a new day. It&apos;s your day. <br />
                You shape it.
              </Typography>
              <Input
                type="email"
                id="email"
                label="Email"
                placeholder="Example@email.com"
                error={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : null
                }
                {...formik.getFieldProps("email")}
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  label="Password"
                  placeholder="At least 8 characters"
                  error={
                    formik.touched.password && formik.errors.password
                      ? formik.errors.password
                      : null
                  }
                  {...formik.getFieldProps("password")}
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

              <Typography
                size="text-sm"
                weight="font-normal"
                color="text-primary"
                className="block text-end grid content-center mb-4"
              >
                <Link href="/forgot-password">Forgot your password?</Link>
              </Typography>

              <InputChecks
                type="checkbox"
                id="remember"
                label={
                  <>
                    I accept the{" "}
                    <span className="underline" onClick={showTermsModal}>
                      terms and conditions
                    </span>
                  </>
                }
                {...formik.getFieldProps("remember")}
              />
              {formik.touched.remember && formik.errors.remember ? (
                <div className="text-red-600">{formik.errors.remember}</div>
              ) : null}
              {error && <div className="text-red-600">{error}</div>}
              <Button
                type="submit"
                variant="btn-primary"
                className="mt-10 px-7 w-full"
                loading={loading}
              >
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
      <dialog id="my_modal_1" className="modal" open={showTerms}>
        <div className="modal-box rounded-none py-10 bg-primary-content max-w-5xl w-full">
          <Button
            size="btn-sm"
            variant="btn-ghost"
            className="absolute right-2 top-2"
            iconPosition="left"
            icon={CloseIcon}
            onClick={hideTermsModal}
          ></Button>
          <Typography
            tag="h4"
            size="text-3xl"
            weight="font-semibold"
            color="text-base-content"
            className="block text-center mb-5"
          >
            Terms and Conditions
          </Typography>
          <Typography
            tag="p"
            size="text-base"
            weight="font-medium"
            color="text-base-200"
            className="bloc mb-3"
          >
            Step-One course powered by Neslife is an educational platform. It does not provide investment advice or tips, nor does it claim any guaranteed returns. All participants must conduct their own research before making investment decisions. Step-One course and its members are not liable for any losses.
          </Typography>
          <Typography
            tag="p"
            size="text-base"
            weight="font-medium"
            color="text-base-200"
            className="block mb-3"
          >
            {" "}
            Fees are not refundable, nontransferable .
Personal investment advice will not be provided at Step ONE .
          </Typography>
          <Typography
            tag="p"
            size="text-base"
            weight="font-medium"
            color="text-base-200"
            className="block mb-3"
          >
            Step-One course does not sell investment products, plans, or policies, nor it is associated with any brokers or financial advisors. It also does not accept sponsorships from external entities, including pharmaceutical or insurance companies. Only doctors and their family members can join Step-One course.
          </Typography>
          <Typography
            tag="p"
            size="text-base"
            weight="font-medium"
            color="text-base-200"
            className="block mb-3"
          >
            Content Access: Assignment videos will be available until the course ends.
          </Typography>
          <Typography
            tag="p"
            size="text-base"
            weight="font-medium"
            color="text-base-200"
            className="block mb-3"
          >
            Compliance: Learners must adhere to rules and not share course content with any outsider.
          </Typography>
          <Typography
            tag="p"
            size="text-base"
            weight="font-medium"
            color="text-base-200"
            className="block mb-3"
          >
             I understand the risks involved in investing, and I am aware of the unpredictable nature of financial markets. The responsibility for any investment decisions, including potential losses, is entirely mine.
          </Typography>
          <Typography
            tag="p"
            size="text-base"
            weight="font-medium"
            color="text-base-200"
            className="block mb-3"
          >
            By participating in Step-One course, I acknowledge that I have read, understood, and agree to the terms, conditions, and declarations stated above.
          </Typography>
          
          <div className="flex flex-wrap gap-3 mt-8 justify-center	">
            <Button
              variant="btn-primary"
              className="btn-sm w-40"
              onClick={hideTermsModal}
            >
              I Agree
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
