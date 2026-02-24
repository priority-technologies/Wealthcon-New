import Typography from "../Typography";
import Input from "../Input";
import Button from "../Button";

export default function CreatePassword({ formik, loading }) {
  return (
    <>
      <Typography
        tag="h1"
        size="text-3xl"
        weight="font-semibold"
        color="text-base-content"
      >
        Forgot Password?
      </Typography>
      <Typography
        tag="h4"
        size="text-base"
        weight="font-normal"
        color="text-base-200"
        className="mt-2 mb-4"
      >
        Don’t worry! It happens. Please enter your email address. An OTP will be
        sent to the email address.
      </Typography>
      <Input
        type="email"
        id="email"
        label="Email"
        placeholder="Example@email.com"
        error={formik.touched.email && formik.errors.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.email}
      />
    </>
  );
}
