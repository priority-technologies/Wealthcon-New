export const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);

  // Normalize dates (set time to 00:00:00) for comparison
  function normalizeDate(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  const normalizedToday = normalizeDate(today);
  const normalizedOneWeekAgo = normalizeDate(oneWeekAgo);
  const normalizedDate = normalizeDate(date);

  if (normalizedDate.getTime() === normalizedToday.getTime()) {
    return "Today";
  } else if (
    normalizedDate >= normalizedOneWeekAgo &&
    normalizedDate < normalizedToday
  ) {
    const daysAgo = Math.floor(
      (normalizedToday - normalizedDate) / (1000 * 60 * 60 * 24)
    );
    return `${daysAgo} day${daysAgo > 1 ? "s" : ""} ago`;
  } else {
    // Format date if it is not today or within the past week
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  }
};

// ======= Example ========
// const customFormattedDate = formatTimestamp(timestamp, 'fr-FR', { weekday: 'short', hour: 'numeric', minute: 'numeric' });
export const formatTimestamp = (timestamp, locale = "en-US", options = {}) => {
  const date = new Date(timestamp);

  // Default formatting options if none provided
  const defaultOptions = {
    weekday: "long", // e.g., Monday
    year: "numeric", // e.g., 2024
    month: "long", // e.g., August
    day: "numeric", // e.g., 27
    hour: "2-digit", // e.g., 10 or 22
    minute: "2-digit", // e.g., 05
    second: "2-digit", // e.g., 09
    // timeZoneName: 'short' // e.g., GMT, PST
  };

  // Merge user options with default options
  const formatOptions = { ...defaultOptions, ...options };

  return date.toLocaleString(locale, formatOptions);
};

export const formatTimestampDateTime = (
  timestamp,
  locale = "en-US",
  options = {}
) => {
  const date = new Date(timestamp);

  const defaultOptions = {
    year: "numeric", // e.g., 2024
    month: "long", // e.g., August
    day: "numeric", // e.g., 26
    hour: "2-digit", // e.g., 09
    minute: "2-digit", // e.g., 25
    hour12: true, // Use 12-hour clock with AM/PM
  };

  const formatOptions = { ...defaultOptions, ...options };

  const formattedDate = date.toLocaleString(locale, formatOptions);

  return formattedDate;
};

export const formatTimestampDate = (
  timestamp,
  locale = "en-US",
  options = {}
) => {
  const date = new Date(timestamp);

  const defaultOptions = {
    year: "numeric", // e.g., 2024
    month: "long", // e.g., August
    day: "numeric", // e.g., 26
  };

  const formatOptions = { ...defaultOptions, ...options };

  const formattedDate = date.toLocaleString(locale, formatOptions);

  return formattedDate;
};

export const formatTimestampOnDays = (timestamp) => {
  const now = new Date();
  const lastOnline = new Date(timestamp);
  const timeDifferenceInSeconds = Math.floor((now - lastOnline) / 1000);

  if (timeDifferenceInSeconds < 60) {
    return "Just now"; // Less than a minute
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (timeDifferenceInSeconds < 86400) {
    // Less than 1 day
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (timeDifferenceInSeconds < 604800) {
    // Less than 1 week
    const days = Math.floor(timeDifferenceInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else {
    const weeks = Math.floor(timeDifferenceInSeconds / 604800);
    const weeksModulo = Math.floor((timeDifferenceInSeconds % 604800) / 86400);

    if (weeks == 1) {
      return "1 week ago";
    } else if (weeks > 1) {
      return `${weeks} weeks ago`;
    } else {
      return "7 days ago";
    }
  }
};

export const formatTimeOnSec = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

export const debounce = (fn, delay) => {
  let timeoutId;

  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

export const getFileType = (fileName) => {
  const fileExtension = fileName.split(".").pop().toLowerCase();

  const fileTypeMap = {
    pdf: "pdf",
    xls: "excel",
    xlsx: "excel",
    png: "image",
    jpg: "image",
    jpeg: "image",
    doc: "word",
    docx: "word",
  };

  return fileTypeMap[fileExtension] || "unknown";
};

export const secToMin = (value) => {
  if (!value) return 0;
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  const formattedDuration = Number(
    `${minutes}.${seconds < 10 ? "0" : ""}${seconds}`
  );
  return formattedDuration;
};

export const minToSec = (value) => {
  if (!value) return 0;

  const [minStr, secStr = "0"] = value.toString().split(".");
  const minutes = parseInt(minStr, 10);
  const seconds = parseInt(secStr.padEnd(2, "0"), 10);

  return minutes * 60 + seconds;
};
