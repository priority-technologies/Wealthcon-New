"use client";

import { usePathname } from "next/navigation";
import Layout from "../components/Layout";
import UserLayout from "../components/UserLayout/UserLayout";
import { useContext } from "react";
import { UserContext } from "./_context/User";
import InitialLoading from "../components/Loading/InitialLoading";

export default function Provider({ children }) {
  const { userDetails } = useContext(UserContext);
  const pathname = usePathname();

  const isPublicPath = ["/login", "/register", "/forgot-password"].includes(
    pathname
  );
  const isAdminPath = pathname.startsWith("/admin");

  if (!isPublicPath && !userDetails) {
    return <InitialLoading />;
  }

  return (
    <>
      {isPublicPath ? (
        children
      ) : isAdminPath ? (
        <Layout data={children} />
      ) : (
        <UserLayout>{children}</UserLayout>
      )}
    </>
  );
}
