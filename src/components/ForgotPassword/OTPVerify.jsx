import Typography from "../Typography";
import Input from "../Input";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { formatTimeOnSec } from "@/helpers/all";

export default function OTPVerify({
  initialtime = 120,
  formik,
  setError,
  handleSendOTP,
}) {
  const [seconds, setSeconds] = useState(initialtime);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    if (timerActive) {
      // Set up the interval
      const intervalId = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(intervalId);
            setTimerActive(false);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);

      // Cleanup interval on component unmount or when timerActive changes
      return () => clearInterval(intervalId);
    }
  }, [timerActive]);

  useEffect(() => {
    if (seconds === 0 && !timerActive) {
      setError("Your OTP has expired. Please request a new one.");
    }
  }, [seconds, timerActive, setError]);

  const startTimer = useCallback(() => {
    setSeconds(initialtime);
    setTimerActive(true);
  }, [initialtime]);

  const handleOtpChange = (e, index) => {
    setError(null);
    const { value } = e.target;

    if (/^\d?$/.test(value)) {
      const newOtpDigits = [...formik.values.otp];
      newOtpDigits[index] = value;
      formik.setFieldValue("otp", newOtpDigits);

      // Move focus to the next input if there is a value
      if (value && index < newOtpDigits.length - 1) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && formik.values.otp[index] === "" && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const hasError =
    formik.errors.otp && formik.errors.otp.some((error) => error);

  return (
    <>
      <Typography
        tag="h1"
        size="text-3xl"
        weight="font-semibold"
        color="text-base-content"
        className="block text-left"
      >
        OTP VERIFICATION
      </Typography>
      <Typography
        tag="h4"
        size="text-base"
        weight="font-normal"
        color="text-base-200"
        className="block text-left pt-1 mb-4 mt-2"
      >
        Enter the OTP sent to {formik.values.email}
      </Typography>
      <div className="flex gap-4">
        {formik.values.otp.map((digit, index) => (
          <Input
            key={index}
            type="text"
            id={`otp-${index}`}
            name={`otp[${index}]`}
            value={digit}
            onChange={(e) => handleOtpChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength="1"
            className="otp-input"
          />
        ))}
      </div>
      {hasError && formik.touched.otp && (
        <div style={{ color: "red", marginTop: "10px" }}>
          {formik.errors.otp.find((error) => error) ||
            "Please enter a valid OTP."}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          tag="p"
          size="text-base"
          weight="font-normal"
          color="text-base-200"
          className="block text-left pt-1 mb-4 mt-2"
        >
          Don’t receive code?{" "}
          <Link
            className={
              seconds ? "disabled cursor-not-allowed" : "text-blue-500"
            }
            href="#"
            onClick={async () => {
              if (!seconds) {
                try {
                  await handleSendOTP(formik.values.email);
                  setError(null);
                  startTimer();
                } catch (error) {
                  setError("Somthing went wrong");
                }
              }
            }}
          >
            resend
          </Link>
        </Typography>
        <Typography
          tag="p"
          size="text-base"
          weight="font-normal"
          color=""
          className="block text-left pt-1 mb-4 mt-2"
        >
          {formatTimeOnSec(seconds)}
        </Typography>
      </div>
    </>
  );
}
