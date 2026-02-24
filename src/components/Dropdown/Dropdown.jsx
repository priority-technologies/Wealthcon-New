"use client";

import Image from "next/image";
import Link from "next/link";
import "./dropdown.scss"; // Assuming there's a corresponding SCSS file for styles
import { Fragment, useState } from "react";
import EditIcon from "../../assets/images/svg/editdots.svg";
import { usePathname } from "next/navigation";

const Dropdown = ({
  setShowModal,
  setConfirmModal,
  setViewUser,
  setEditMessage,
  item,
  className,
  ...rest
}) => {
  const pathname = usePathname();
  const classes = `${className || ""}`;
  const tabIndex = 1;

  return (
    <Fragment>
      <div
        className={`dropdown cursor-pointer dropdown-end ${classes}`}
        {...rest}
      >
        <div
          tabIndex={tabIndex}
          role="button"
          className=" m-1 text-base-100 editIcons"
        >
          <Image src={EditIcon} alt="icon" />
        </div>
        <ul
          tabIndex={tabIndex}
          className="dropdown-content z-10 menu p-2 mt-2 shadow bg-primary-content rounded-box w-48 dropdown-tag"
        >
          {[
            "/admin/yt_session",
            "/admin/live_session",
            "/admin/notes",
          ].includes(pathname) && (
            <li>
              <Link
                href="#"
                className="text-base-100 text-sm font-medium"
                onClick={() => setShowModal(true)}
                // onClick={() => setEditMessage(true)}
              >
                Edit
              </Link>
            </li>
          )}
          {["/admin/message", "/admin/announcement"].includes(pathname) && (
            <li>
              <Link
                href="#"
                className="text-base-100 text-sm font-medium"
                // onClick={() => setShowModal(true)}
                onClick={() => setEditMessage(true)}
              >
                Edit
              </Link>
            </li>
          )}
          <li>
            <Link
              href="#"
              className="text-base-100 text-sm font-medium"
              onClick={() => setConfirmModal(true)}
            >
              Delete
            </Link>
          </li>
          {["/admin/message", "/admin/announcement", "/admin/gallery"].includes(
            pathname
          ) && (
            <li>
              <Link
                href="#"
                className="text-base-100 text-sm font-medium"
                onClick={() => setViewUser(true)}
              >
                View
              </Link>
            </li>
          )}
          {/* <li><Link href="#" className="text-base-100 text-sm font-medium" >Deactivate</Link></li> */}
        </ul>
      </div>
    </Fragment>
  );
};

export default Dropdown;
