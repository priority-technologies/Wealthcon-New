"use client";

import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import React, { createContext, useEffect, useState } from "react";

const UserContext = createContext(undefined);

function UserContextProvider({ children }) {
  const router = useRouter();
  const path = usePathname();
  const [userDetails, setUserDetails] = useState(null);
  const [liveSessions, setLiveSessions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [messages, setMessages] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementPopup, setAnnouncementPopup] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const isPublicPath = ["/login", "/register", "/forgot-password"].includes(
    path
  );

  const fetchData = async () => {
    try {
      const [userDetails, announcement] = await Promise.all([
        axios.get("/api/auth/profile"),
        axios.get("/api/announcements"),
      ]);

      if (userDetails.status === 200 && announcement.status === 200) {
        setUserDetails(userDetails.data);
        setAnnouncementPopup(announcement.data);
      }
    } catch (error) {
      if (error?.response?.status === 401) {
        return router.push("/login");
      }
      console.error("Error while fetching user data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log("User context api start");

    if (!isPublicPath) {
      fetchData();
    }
  }, [isPublicPath]);

  return (
    <UserContext.Provider
      value={{
        userDetails,
        setUserDetails,
        liveSessions,
        setLiveSessions,
        notes,
        setNotes,
        gallery,
        setGallery,
        announcementPopup,
        announcements,
        setAnnouncements,
        messages,
        setMessages,
        quotes,
        setQuotes,
        loading,
        setLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserContextProvider, UserContext };
