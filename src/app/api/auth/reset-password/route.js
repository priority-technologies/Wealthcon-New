import connectToDatabase from "@/_database/mongodb";
import Users from "@/schemas/Users";
import { NextResponse } from "next/server";
import crypto from "crypto";

const headers = {
  "Set-Cookie": `resetToken=''; HttpOnly=true;  expires: ${new Date(
    0
  )}; Path=/`,
};

const key = Buffer.from(
  "a4dcb3c8f6a1e6b2e2d1c0b80e5c7f9a9e68b0e7a1d2f2b1b14e0cfae4e9d80f",
  "hex"
);

function decryptData(encryptedData) {
  const [encrypted, ivHex] = encryptedData.split(":");
  const ivBuffer = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, ivBuffer);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export async function PUT(request) {
  try {
    const cookies = request.cookies;
    const resetToken = cookies.get("pqr")?.value || "";

    const { email, password, confirmPassword } = await request.json();

    if (!email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: "Required fields are missing or invalid" },
        { status: 400 }
      );
    }
    
    if (!resetToken) {
      return NextResponse.json(
        { error: "Please try again later" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await Users.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        {
          status: 404,
        }
      );
    }

    if (!user.resetToken) {
      return NextResponse.json(
        { error: "Reset token not found. Please verify OTP." },
        { status: 400 }
      );
    }

    const decryptedToken = decryptData(user.resetToken);
    const decryptedRequestToken = decryptData(resetToken);

    if (decryptedToken !== decryptedRequestToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400, headers }
      );
    }

    const now = new Date();
    const tokenExpiryDate = new Date(user.resetTokenExpiry);

    if (now > tokenExpiryDate) {
      return NextResponse.json(
        { error: "Reset token has expired" },
        { status: 400, headers }
      );
    }

    user.otp = "";
    user.otpExpiry = "";
    user.resetToken = "";
    user.resetTokenExpiry = "";
    user.password = password;
    user.updatedAt = Date.now();

    await user.save();

    return NextResponse.json({
      message: "Password updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
