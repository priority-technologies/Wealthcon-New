export const generateRandomUsername = (firstName, lastName) => {
  const firstNameParts = firstName.toLowerCase().trim().split(" ");
  const lastNameParts = lastName.toLowerCase().trim().split(" ");
  const username = [...firstNameParts, ...lastNameParts].join("");

  const randomNumber = Math.floor(Math.random() * 10000);
  const finalUsername = `${username}${randomNumber}`;

  return finalUsername;
};

export const isValidOTP = (otp) => {
  const otpRegex = /^\d{5}$/; // Regular expression to match exactly 6 digits
  return otpRegex.test(otp);
};

export function isMoreThanHours(date, hour = 24) {
  const now = new Date();

  const lastLoginDate = new Date(date);

  const differenceInMs = now - lastLoginDate;

  const fortyEightHoursInMs = Number(hour) * 60 * 60 * 1000; // 48 hours in milliseconds

  return differenceInMs > fortyEightHoursInMs;
}

export function detectBrowserAndDevice(userAgent) {
  let browser = "Unknown Browser";
  let deviceType = "Desktop";
  let deviceName = "Unknown Device";

  // Detect the device name based on user-agent keywords
  if (userAgent.includes("iPhone")) {
    deviceType = "Mobile";
    deviceName = "iPhone";
  } else if (userAgent.includes("iPad")) {
    deviceType = "Tablet";
    deviceName = "iPad";
  } else if (userAgent.includes("iPod")) {
    deviceType = "Mobile";
    deviceName = "iPod";
  } else if (userAgent.includes("Android")) {
    deviceType = "Mobile";
    deviceName = "Android";
  } else if (userAgent.includes("Windows Phone")) {
    deviceType = "Mobile";
    deviceName = "Windows Phone";
  } else if (userAgent.includes("Macintosh")) {
    deviceName = "Mac";
  } else if (userAgent.includes("Windows NT")) {
    deviceName = "Windows PC";
  } else if (userAgent.includes("Linux")) {
    deviceName = "Linux";
  } else if (userAgent.includes("CrOS")) {
    deviceName = "Chrome OS";
  }

  // Detect browsers
  if (userAgent.includes("Edg")) {
    browser = "Microsoft Edge";
  } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
    browser = "Opera";
  } else if (userAgent.includes("Brave")) {
    browser = "Brave";
  } else if (
    userAgent.includes("Chrome") &&
    !userAgent.includes("Edg") &&
    !userAgent.includes("OPR")
  ) {
    browser = "Chrome";
  } else if (
    userAgent.includes("Firefox") ||
    userAgent.includes("fxios") ||
    userAgent.includes("focus")
  ) {
    browser = "Firefox";
  } else if (
    userAgent.includes("Safari") &&
    !userAgent.includes("Chrome") &&
    !userAgent.includes("OPR")
  ) {
    browser = "Safari";
  } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
    browser = "Internet Explorer";
  }

  return { browser, deviceType, deviceName };
}
