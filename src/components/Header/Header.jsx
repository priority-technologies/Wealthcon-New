"use client";

import Search from "../Search/Search";
import Profile from "../Dropdown/Profile";
import ProfileImage from "../../assets/images/svg/profile.svg";
import ProfileDarkImage from "../../assets/images/svg/profiledark.svg";
import Image from "next/image";
import Link from "next/link";
import Logo from "../../assets/images/svg/logo.svg";
import HamburgerIcon from "../../assets/images/svg/hamburgerIcon.svg";
import AngleIcon from "../../assets/images/svg/hamburgerIconReverce.svg";
import Notification from "../../assets/images/svg/notification.svg";
import SearchIcon from "../../assets/images/svg/search.svg";
import { Fragment, useContext, useState } from "react";
import { UserContext } from "../../app/_context/User";
import axios from "axios";
import { useRouter } from "next/navigation";

const Header = ({ toggleSideMenu, setToggleSideMenu }) => {
  const router = useRouter();
  const { userDetails } = useContext(UserContext);
  const [showSearch, setShowSearch] = useState(true);
  const [loading, setLoading] = useState(true);
  const [notificationData, setNotificationData] = useState([]);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const toggleSideBar = () => {
    setToggleSideMenu(toggleSideMenu === "default" ? "onlyIcons" : "default");
  };

  const getNotifications = () => {
    // Check if notification data already exists
    if (notificationData.length === 0) {
      axios
        .get(`/api/notifications`)
        .then((res) => {
          if (res && res.data) {
            setNotificationData(res.data);
          }
        })
        .catch((error) => {
          if (error?.response?.status === 401) {
            return router.push("/login");
          }
          console.error("Error fetching notifications:", error);
        })
        .finally(() => setLoading(false));
    }
  };
  return (
    <Fragment>
      {/* nav bar for mobile */}
      <div className="navbar fixed w-full z-[1] lg:hidden px-5 py-0 bg-primary">
        <div className="navbar-start flex gap-4">
          <div className="dropdown">
            <label htmlFor="my-drawer" className="p-4 drawer-button">
              <Image src={HamburgerIcon} alt="icon" className="rotate-180" />
            </label>
          </div>
          <Link
            href={
              userDetails?.role === "admin" ||
              userDetails?.role === "superAdmin"
                ? "/admin"
                : "/home"
            }
          >
            <Image src={Logo} alt="logo" className="text-center " />
          </Link>
        </div>
        <div className="navbar-end gap-4">
          <Image
            src={SearchIcon}
            alt="search"
            className="cursor-pointer mobile-search"
            onClick={toggleSearch}
          />
          <div className={`dropdown cursor-pointer dropdown-end`}>
            <div
              className="notifications mobile"
              tabIndex={0}
              role="button"
              onClick={getNotifications}
            >
              <Image src={Notification} alt="icon" />
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content z-10 menu p-2 mt-2 shadow bg-primary-content searchDropdown dropdown-tag"
            >
              {loading && <li>Loading...</li>}
              {notificationData?.videos?.map((video) => (
                <li key={video._id}>
                  <Link href={`/live_session/${video._id}`}>
                    {video.title} (Video)
                  </Link>
                </li>
              ))}
              {notificationData?.notes?.map((note) => (
                <li key={note._id}>
                  <Link href={`/notes/${note._id}`}>{note.title} (Notes)</Link>
                </li>
              ))}
              {notificationData?.gallery?.map((image) => (
                <li key={image._id}>
                  <Link href={`/admin/gallery`}>{image?.title} (Gallery)</Link>
                </li>
              ))}
              {notificationData?.videos?.length === 0 &&
              notificationData?.notes?.length === 0 &&
              notificationData?.gallery?.length === 0 ? (
                <div>Data Not Available</div>
              ) : null}
            </ul>
          </div>
          <Profile profileImage={ProfileImage} />
        </div>
      </div>
      {!showSearch && (
        <div className="lg:hidden block bg-primary-content px-5 py-2 shadow mobile">
          <Search />
        </div>
      )}

      {/* navbar for desktop */}
      <div className="hidden lg:flex flex-wrap justify-between items-center p-4 shadow-sm bg-primary-content sticky top-0 z-10">
        <div className="flex place-items-center gap-3">
          <div className="dropdown">
            <label htmlFor="my-drawer" className="drawer-button cursor-pointer">
              {toggleSideMenu === "default" ? (
                <Image src={HamburgerIcon} alt="icon" onClick={toggleSideBar} />
              ) : (
                <Image src={AngleIcon} alt="icon" onClick={toggleSideBar} />
              )}
            </label>
          </div>
          <Search />
        </div>
        <div className="flex place-items-center gap-3">
          <div className={`dropdown cursor-pointer dropdown-end`}>
            <div
              className="notifications"
              tabIndex={0}
              role="button"
              onClick={getNotifications}
            >
              <Image src={Notification} alt="icon" />
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content z-10 menu p-2 mt-2 shadow bg-primary-content searchDropdown dropdown-tag"
            >
              {loading && <li>Loading...</li>}
              {notificationData?.videos?.map((video) => (
                <li key={video._id}>
                  <Link href={`/live_session/${video._id}`}>
                    {video.title} (Video)
                  </Link>
                </li>
              ))}
              {notificationData?.notes?.map((note) => (
                <li key={note._id}>
                  <Link href={`/notes/${note._id}`}>{note.title} (Notes)</Link>
                </li>
              ))}
              {notificationData?.gallery?.map((image) => (
                <li key={image._id}>
                  <Link href={`/admin/gallery`}>{image?.title} (Gallery)</Link>
                </li>
              ))}
              {notificationData?.videos?.length === 0 &&
              notificationData?.notes?.length === 0 &&
              notificationData?.gallery?.length === 0 ? (
                <div>Data Not Available</div>
              ) : null}
            </ul>
          </div>
          <Profile
            title={`${userDetails?.username}`}
            profileImage={ProfileDarkImage}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Header;
