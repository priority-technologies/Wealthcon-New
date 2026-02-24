import React from "react";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "login",
  description:
    "TMP Wealthcon is an educational platform. It does not provide investment advice or tips, nor does it claim any guaranteed returns.",
};

export default function page() {
  return <LoginForm />;
}
