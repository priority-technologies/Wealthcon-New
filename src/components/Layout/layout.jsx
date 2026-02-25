"use client";

import Image from "next/image";
import Logo from "../../assets/images/svg/logo.svg";
import SmallLogo from "../../assets/images/svg/smalllogo.svg";
import downAngle from "../../assets/images/svg/downAngle2.svg";
import Dashbord from "../../assets/images/svg/dashbord.svg";
import CMS from "../../assets/images/svg/cms.svg";
import UMS from "../../assets/images/svg/ums.svg";
import Live from "../../assets/images/svg/live.svg";
import Notes from "../../assets/images/svg/notes.svg";
import Gallery from "../../assets/images/svg/gallary.svg";
import Message from "../../assets/images/svg/message.svg";
import Quotes from "../../assets/images/svg/quotes.svg";
import AnnouncementSvg from "../../assets/images/svg/announcement.svg";
import homeIcon from "../../assets/images/svg/homeIcon.svg";
import "./layout.scss";
import Link from "next/link";
import Header from "../Header/Header";
import { Fragment, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { UserContext } from "@/app/_context/User";
import Announcement from "../Modal/Announcement";
import usePreventActions from "@/hooks/usePreventActions";

const Layout = ({ className, data }) => {
  usePreventActions();
  const { userDetails, announcementPopup } = useContext(UserContext);
  const classes = `${className || ""}`;
  const [toggleSideMenu, setToggleSideMenu] = useState("default");
  const [menuDownActive, SetMenuDownActive] = useState(true);
  const pathname = usePathname();

  const closeDrawer = () => {
    document.getElementById("my-drawer").checked = false;
  };

  return (
    <Fragment>
      <div
        className={`${classes} ${toggleSideMenu} drawer lg:drawer-open w-auto hiddan`}
      >
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content bg-base-300">
          <Header
            toggleSideMenu={toggleSideMenu}
            setToggleSideMenu={setToggleSideMenu}
          />
          {/* {userDetails && announcementPopup && (
            <Announcement data={announcementPopup} />
          )} */}
          <div className="main-container m-5 bg-primary-content p-5 relative">
            {data}
          </div>
        </div>
        
        <div className={`drawer-side z-10	 lg:relative lg:bg-primary`}>
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="menu px-0 pt-0 text-base-content bg-primary block">
            <div className="py-6 logo-image grid place-content-center sticky top-0 bg-primary z-10">
              <Link
                href={
                  userDetails?.role === "admin" ||
                  userDetails?.role === "superAdmin"
                    ? "/admin"
                    : "/home"
                }
                onClick={closeDrawer}
              >
                <Image
                  src={toggleSideMenu === "default" ? Logo : SmallLogo}
                  alt="logo"
                  className="text-center"
                />
              </Link>
            </div>
            <div className="pt-6 bg-primary ">
              {userDetails?.role === "admin" ||
              userDetails?.role === "superAdmin" ? (
                <ul className="side-menu">
                  <li onClick={() => SetMenuDownActive(false)}>
                    <Link
                      href="/admin"
                      className={`text-primary-content text-base px-6 py-4 ${
                        ["/admin"].includes(pathname) ? "active-tab" : ""
                      }`}
                      onClick={closeDrawer}
                    >
                      <Image
                        src={Dashbord}
                        alt="logo"
                        className="text-center mr-2"
                      />
                      {toggleSideMenu === "default" && "Dashboard"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={() => SetMenuDownActive(!menuDownActive)}
                      href="/admin/live_session"
                      className={`text-primary-content text-base px-6 py-4 ${
                        [
                          "/admin/live_session",
                          "/admin/shorts",
                          "/admin/notes",
                          "/admin/gallery",
                          "/admin/message",
                          "/admin/announcement",
                          "/admin/channels",
                        ].includes(pathname)
                          ? "active-tab"
                          : ""
                      }`}
                    >
                      <Image
                        src={CMS}
                        alt="logo"
                        className="text-center mr-2"
                      />
                      {toggleSideMenu === "default" && (
                        <>
                          Content Management
                          <Image
                            src={downAngle}
                            alt="logo"
                            className={`text-center ml-2 ${
                              menuDownActive ? "ArrowUp" : "ArrowDown"
                            }`}
                          />
                        </>
                      )}
                    </Link>
                    {menuDownActive && (
                      <ul className="side-sub-menu py-0 ml-0 my-2">
                        <li>
                          <Link
                            href="/admin/live_session"
                            className={`text-primary-content text-base px-6 py-4  ${
                              ["/admin/live_session"].includes(pathname)
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {
                              closeDrawer();
                              window?.sessionStorage?.removeItem("lp");
                            }}
                          >
                            <Image
                              src={Live}
                              alt="logo"
                              className="text-center mr-2"
                            />
                            {toggleSideMenu === "default" && "Videos"}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/admin/shorts"
                            className={`text-primary-content text-base px-6 py-4  ${
                              ["/admin/shorts"].includes(pathname)
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {
                              closeDrawer();
                              window?.sessionStorage?.removeItem("lp");
                            }}
                          >
                            <Image
                              src={Live}
                              alt="logo"
                              className="text-center mr-2"
                            />
                            {toggleSideMenu === "default" && "Shorts"}
                          </Link>
                        </li>
                        {/* <li>
                          <Link
                            href="/admin/shorts"
                            className={`text-primary-content text-base px-6 py-4  ${
                              ["/admin/shorts"].includes(pathname)
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {
                              closeDrawer();
                              window?.sessionStorage?.removeItem("lp");
                            }}
                          >
                            <Image
                              src={Live}
                              alt="logo"
                              className="text-center mr-2"
                            />
                            {toggleSideMenu === "default" && "Shorts"}
                          </Link>
                        </li> */}
                        <li>
                          <Link
                            href="/admin/notes"
                            className={`text-primary-content text-base px-6 py-4  ${
                              ["/admin/notes"].includes(pathname)
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {
                              closeDrawer();
                              window?.sessionStorage?.removeItem("np");
                            }}
                          >
                            <Image
                              src={Notes}
                              alt="logo"
                              className="text-center mr-2"
                            />
                            {toggleSideMenu === "default" && "Notes"}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/admin/gallery"
                            className={`text-primary-content text-base px-6 py-4  ${
                              ["/admin/gallery"].includes(pathname)
                                ? "active"
                                : ""
                            }`}
                            onClick={closeDrawer}
                          >
                            <Image
                              src={Gallery}
                              alt="logo"
                              className="text-center mr-2"
                            />
                            {toggleSideMenu === "default" && "Charts"}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/admin/bg-images"
                            className={`text-primary-content text-base px-6 py-4  ${
                              ["/admin/bg-images"].includes(pathname)
                                ? "active"
                                : ""
                            }`}
                            onClick={() => {
                              closeDrawer();
                              window?.sessionStorage?.removeItem("np");
                            }}
                          >
                            <Image
                              src={Notes}
                              alt="logo"
                              className="text-center mr-2"
                            />
                            {toggleSideMenu === "default" && "Auth Images"}
                          </Link>
                        </li>
                        {/* <li>
                          <Link
                            href="/admin/gallery"
                            className={`text-primary-content text-base px-6 py-4  ${
                              ["/admin/gallery"].includes(pathname)
                                ? "active"
                                : ""
                            }`}
                            onClick={closeDrawer}
                          >
                            <Image
                              src={Gallery}
                              alt="logo"
                              className="text-center mr-2"
                            />
                            {toggleSideMenu === "default" && "Charts"}
                          </Link>
                        </li> */}
                        <li>
                          <Link
                            href="/admin/message"
                            className={`text-primary-content text-base px-6 py-4  ${
                              ["/admin/message"].includes(pathname)
                                ? "active"
                                : ""
                            }`}
                            onClick={closeDrawer}
                          >
                            <Image
                              src={Message}
                              alt="logo"
                              className="text-center mr-2"
                            />
                            {toggleSideMenu === "default" && "Dr. Ram's Messages"}
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/admin/announcement"
                            className={`text-primary-content text-base px-6 py-4  ${
                              ["/admin/announcement"].includes(pathname)
                                ? "active"
                                : ""
                            }`}
                            onClick={closeDrawer}
                          >
                            <Image
                              src={AnnouncementSvg}
                              alt="logo"
                              className="text-center mr-2"
                            />
                            {toggleSideMenu === "default" && "Admin's Update"}
                          </Link>
                        </li>
                        <li>
                        <Link
                          href="/admin/channels"
                          className={`text-primary-content text-base px-6 py-4  ${
                            ["/admin/channels"].includes(pathname)
                              ? "active"
                              : ""
                          }`}
                          onClick={closeDrawer}
                        >
                          <Image
                            src={Quotes }
                            alt="logo"
                            className="text-center mr-2"
                          />
                          {toggleSideMenu === "default" && "Channels"}
                        </Link>
                      </li>
                      
                      </ul>
                    )}
                  </li>
                  <li onClick={() => SetMenuDownActive(false)}>
                    <Link
                      href="/admin/users"
                      className={`text-primary-content text-base px-6 py-4  ${
                        ["/admin/users"].includes(pathname) ? "active-tab" : ""
                      }`}
                      onClick={closeDrawer}
                    >
                      <Image
                        src={UMS}
                        alt="logo"
                        className="text-center mr-2"
                      />
                      {toggleSideMenu === "default" && "User Management"}
                    </Link>
                  </li>
                </ul>
              ) : (
                <ul
                  className={`${
                    toggleSideMenu === "default" ? "w-72" : "w-auto"
                  } side-menu`}
                > 
                  <li>
                  <Link
                    href="/home"
                    className={`text-primary-content text-base px-6 py-4 ${
                      pathname === "/home" ? "active-tab" : ""
                    }`}
                    onClick={() => {
                      closeDrawer();
                      window?.sessionStorage?.removeItem("lp");
                    }}
                  >
                    <Image
                      src={homeIcon}
                      alt="logo"
                      className="text-center mr-2"
                    />
                    {toggleSideMenu === "default" && "Home"}
                  </Link>
                  </li>
                  <li>
                    <Link
                      href={userDetails?.role === "graduate" || userDetails?.role === "guide" ? "/yt_session" : "/live_session"}
                      className={`text-primary-content text-base px-6 py-4 ${
                        pathname === "/live_session" ? "active-tab" : ""
                      }`}
                      onClick={() => {
                        closeDrawer();
                        window?.sessionStorage?.removeItem("lp");
                      }}
                    >
                      <Image
                        src={Live}
                        alt="logo"
                        className="text-center mr-2"
                      />
                      {toggleSideMenu === "default" && "Videos"}
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      href="/shorts"
                      className={`text-primary-content text-base px-6 py-4 ${
                        pathname === "/shorts" ? "active-tab" : ""
                      }`}
                      onClick={() => {
                        closeDrawer();
                        window?.sessionStorage?.removeItem("lp");
                      }}
                    >
                      <Image
                        src={Live}
                        alt="logo"
                        className="text-center mr-2"
                      />
                      {toggleSideMenu === "default" && "Shorts"}
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      href="/notes"
                      className={`text-primary-content text-base px-6 py-4 ${
                        pathname === "/notes" ? "active-tab" : ""
                      }`}
                      onClick={() => {
                        closeDrawer();
                        window?.sessionStorage?.removeItem("np");
                      }}
                    >
                      <Image
                        src={Notes}
                        alt="logo"
                        className="text-center mr-2"
                      />
                      {toggleSideMenu === "default" && "Notes & Charts"}
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      href="/gallery"
                      className={`text-primary-content text-base px-6 py-4 ${
                        pathname === "/gallery" ? "active-tab" : ""
                      }`}
                      onClick={closeDrawer}
                    >
                      <Image
                        src={Gallery}
                        alt="logo"
                        className="text-center mr-2"
                      />
                      {toggleSideMenu === "default" && "Charts"}
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      href="/message"
                      className={`text-primary-content text-base px-6 py-4 ${
                        pathname === "/message" ? "active-tab" : ""
                      }`}
                      onClick={closeDrawer}
                    >
                      <Image
                        src={Message}
                        alt="logo"
                        className="text-center mr-2"
                      />
                      {toggleSideMenu === "default" && "Dr. Ram's Messages"}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/announcement"
                      className={`text-primary-content text-base px-6 py-4 ${
                        pathname === "/announcement" ? "active-tab" : ""
                      }`}
                      onClick={closeDrawer}
                    >
                      <Image
                        src={AnnouncementSvg}
                        alt="logo"
                        className="text-center mr-2"
                      />
                      {toggleSideMenu === "default" && "Admin's Update"}
                    </Link>
                  </li>
                  
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Layout;
