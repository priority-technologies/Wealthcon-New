import AWS from "aws-sdk";

// Configure S3 client - use LocalStack in development, AWS in production
const s3Config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || "test",
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "test",
  region: process.env.AWS_REGION || "us-east-1",
  useAccelerateEndpoint: false,
  httpOptions: {
    timeout: 300000, // 5 minutes
    connectTimeout: 300000, // 5 minutes
  },
};

// Add LocalStack endpoint for development - use if AWS_ENDPOINT is explicitly set
if (process.env.AWS_ENDPOINT) {
  console.log(`[S3] Using LocalStack endpoint: ${process.env.AWS_ENDPOINT}`);
  s3Config.endpoint = process.env.AWS_ENDPOINT;
  s3Config.s3ForcePathStyle = true; // Required for LocalStack
} else if (process.env.NODE_ENV === "development") {
  console.log("[S3] Using AWS S3 in development mode");
}

export const s3 = new AWS.S3(s3Config);

export const adminRoleObject = {
  admin: "Admin",
  lot1: "Lot 1",
  lot2: "Lot 2",
  lot3: "Lot 3",
  lot4: "Lot 4",
  lot5: "Lot 5",
  lot6: "Lot 6",
  lot7: "Lot 7",
  lot8: "Lot 8",
  lot9: "Lot 9",
  lot10: "Lot 10",
  lot11: "Lot 11",
  lot12: "Lot 12",
  lot13: "Lot 13",
  lot14: "Lot 14",
  lot15: "Lot 15",
};

export const roleObject = {
  all: "all",
  admin: "admin",
  "lot 1": "lot1",
  "lot 2": "lot2",
  "lot 3": "lot3",
  "lot 4": "lot4",
  "lot 5": "lot5",
  "lot 6": "lot6",
  "lot 7": "lot7",
  "lot 8": "lot8",
  "lot 9": "lot9",
  "lot 10": "lot10",
  "lot 11": "lot11",
  "lot 12": "lot12",
  "lot 13": "lot13",
  "lot 14": "lot14",
  "lot 15": "lot15",
};

export const roles = [
  "admin",
  "lot1",
  "lot2",
  "lot3",
  "lot4",
  "lot5",
  "lot6",
  "lot7",
  "lot8",
  "lot9",
  "lot10",
  "lot11",
  "lot12",
  "lot13",
  "lot14",
  "lot15",
];
export const adminRoles = ["all", ...roles];

export const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Lot 1", value: "lot1" },
  { label: "Lot 2", value: "lot2" },
  { label: "Lot 3", value: "lot3" },
  { label: "Lot 4", value: "lot4" },
  { label: "Lot 5", value: "lot5" },
  { label: "Lot 6", value: "lot6" },
  { label: "Lot 7", value: "lot7" },
  { label: "Lot 8", value: "lot8" },
  { label: "Lot 9", value: "lot9" },
  { label: "Lot 10", value: "lot10" },
  { label: "Lot 11", value: "lot11" },
  { label: "Lot 12", value: "lot12" },
  { label: "Lot 13", value: "lot13" },
  { label: "Lot 14", value: "lot14" },
  { label: "Lot 15", value: "lot15" },
];

export const bgImageUploadPath = "/uploads/bg-images";