import Image from "next/image";
import DropdownIcon from "../../assets/images/svg/downAngle.svg";
import Link from "next/link";
import Typography from "../Typography";
import "./dropdown.scss";
import { Fragment, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { UserContext } from "../../app/_context/User";

const Profile = ({ title, className, profileImage, position, ...rest }) => {
  const { setUserDetails, setLiveSessions, setNotes, setGallery, setMessages } =
    useContext(UserContext);

  const router = useRouter();
  const classes = `${className || ""}`;
  const tabIndex = 1;

  // Helper function to clear session storage and reset user-related data
  const clearSessionData = () => {
    window?.sessionStorage?.removeItem("announcement");
    window?.sessionStorage?.removeItem("lp");
    window?.sessionStorage?.removeItem("np");
    setUserDetails(null);
    setLiveSessions([]);
    setNotes([]);
    setGallery([]);
    setMessages([]);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get("/api/auth/logout");
  
      if (response?.status === 200) {
        clearSessionData();
        router.push("/login");
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        clearSessionData();
        return router.push("/login");
      }
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <Fragment>
      <div
        className={`dropdown cursor-pointer dropdown-end ${classes}`}
        {...rest}
      >
        <div tabIndex={tabIndex} className="m-1 flex gap-4 items-start">
          <div className="flex flex-row gap-4">
            {profileImage && (
              <div className="profileImage flex-1">
                <Image src={profileImage} alt="profileImage" />
              </div>
            )}
            <div className="flex-row gap-4 hidden lg:flex">
              <div className="profileData flex items-center">
                <Typography
                  tag="h4"
                  title={title}
                  size="text-base"
                  weight="font-normal"
                  color="text-info-content"
                >
                  {title}
                </Typography>
                <Typography
                  tag="h6"
                  title={position}
                  size="text-sm"
                  weight="font-normal"
                  color="text-neutral-content"
                >
                  {position}
                </Typography>
              </div>
              <div className="pt-2 ">
                <Image src={DropdownIcon} alt="icon" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile dropdown */}
        <ul
          tabIndex={tabIndex}
          className="dropdown-content z-10 menu p-2 mt-2 shadow bg-primary-content rounded-box w-48 dropdown-tag"
        >
          {/* <li><Link onClick={handleLogout} href='#' className='text-base-100 text-sm font-medium'>Logout</Link></li> */}
          {/* <li><Link href="/about" className='text-base-100 text-sm font-medium'>Edit Profile</Link></li> */}
          <li>
            <Link
              href="/watch_later"
              className="text-base-100 text-sm font-medium"
            >
              Watch later
            </Link>
          </li>
          <li>
            <Link
              href="#"
              onClick={handleLogout}
              className="text-base-100 text-sm font-medium"
            >
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </Fragment>
  );
};

export default Profile;
