import { UserContext } from "@/app/_context/User";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";

const usePreventActions = () => {
  const { userDetails } = useContext(UserContext);
  const path = usePathname();
  const isPublicPath =
    path === "/login" || path === "/register" || path === "/forgot-password";
    
  // Disable right-click
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  // Disable F12 key and Developer Tools shortcuts
  const handleDevToolsKeys = (e) => {
    if (
      e.key === "F12" || // F12 (opens DevTools)
      (e.ctrlKey && e.shiftKey && e.key === "I") || // Ctrl+Shift+I (opens DevTools)
      (e.ctrlKey && e.shiftKey && e.key === "J") || // Ctrl+Shift+J (opens DevTools in console)
      (e.ctrlKey && e.shiftKey && e.key === "C") || // Ctrl+Shift+C (opens element inspector)
      (e.ctrlKey && e.shiftKey && e.key === "K") // Ctrl+Shift+K (open Web Console)
    ) {
      e.preventDefault();
    }
  };

  // Disable Print Screen key and copy a message to clipboard
  const copyToClipboard = () => {
    const aux = document.createElement("input");
    aux.setAttribute(
      "value",
      "Screenshots are disabled on this page. This is part of a security measure."
    );
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
    // alert("Print screen is disabled.");
  };

  // Disable Print Screen key
  const handlePrintScreen = (e) => {
    if (e.key === "PrintScreen") {
      // alert("PrintScreen");
      navigator.clipboard.writeText(""); // Clear clipboard
    }
  };

  // Handle keyup event for PrintScreen
  const handleKeyUp = (e) => {
    if (e.keyCode === 44) {
      e.preventDefault;
      // KeyCode for PrintScreen
      copyToClipboard();
    }
  };

  // Prevent Ctrl+Shift+S for screenshots and Ctrl+P for print dialog
  const handleShortcut = (e) => {
    if (
      (e.ctrlKey && e.shiftKey && e.key === "S") || // Ctrl+Shift+S (save/screenshot)
      (e.ctrlKey && e.shiftKey && e.key === "P") || // Ctrl+Shift+P (print dialog)
      (e.ctrlKey && e.key === "p") // Ctrl+P (print dialog)
    ) {
      e.preventDefault();
    }
  };

  // Hide content when the window loses focus to prevent screen recording
  const handleWindowFocus = () => {
    document.body.style.filter = "none"; // Clear blur effect when focused
  };

  const handleWindowBlur = () => {
    document.body.style.filter = "blur(10px)"; // Blur when window loses focus
  };

  // Disable copy/cut/paste functionality
  const handleCopyCutPaste = (e) => {
    if (
      !isPublicPath &&
      (e.type === "copy" || e.type === "cut" || e.type === "paste")
    ) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (userDetails?.role === "admin" || userDetails?.role === "superAdmin") {
      return;
    }

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu); // Disable right-click
    document.addEventListener("keydown", handleDevToolsKeys); // Disable Developer Tools shortcuts
    document.addEventListener("keydown", handleShortcut); // Prevent print & screenshot shortcuts
    document.addEventListener("keydown", handlePrintScreen); // Disable PrintScreen key
    document.addEventListener("keyup", handleKeyUp); // Prevent screenshots
    // window.addEventListener("focus", handleWindowFocus); // Handle window focus
    // window.addEventListener("blur", handleWindowBlur); // Handle window blur
    document.addEventListener("copy", handleCopyCutPaste); // Disable copy
    document.addEventListener("cut", handleCopyCutPaste); // Disable cut
    document.addEventListener("paste", handleCopyCutPaste); // Disable paste

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleDevToolsKeys);
      document.removeEventListener("keydown", handleShortcut);
      document.removeEventListener("keydown", handlePrintScreen);
      document.removeEventListener("keyup", handleKeyUp);
      // window.removeEventListener("focus", handleWindowFocus);
      // window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("copy", handleCopyCutPaste);
      document.removeEventListener("cut", handleCopyCutPaste);
      document.removeEventListener("paste", handleCopyCutPaste);
    };
  }, [userDetails]);
};

export default usePreventActions;
