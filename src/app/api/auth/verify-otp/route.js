import connectToDatabase from "@/_database/mongodb";
import { isValidOTP } from "@/helpers/Backend";
import Users from "@/schemas/Users";
import bcryptjs from "bcryptjs";
import { NextResponse } from "next/server";
import crypto from "crypto";

const key = Buffer.from(
  "a4dcb3c8f6a1e6b2e2d1c0b80e5c7f9a9e68b0e7a1d2f2b1b14e0cfae4e9d80f",
  "hex"
);

function encryptData(data) {
  const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${encrypted}:${iv.toString("hex")}`;
}

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: "Email and OTP are required" },
        {
          status: 400,
        }
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

    if (!isValidOTP(otp)) {
      return NextResponse.json(
        { error: "Invalid OTP format" },
        { status: 400 }
      );
    }

    const isMatch = await bcryptjs.compare(otp, user.otp);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Incorrect OTP" },
        {
          status: 400,
        }
      );
    }

    const now = new Date();
    const tokenExpiryDate = new Date(user.otpExpiry);

    if (now > tokenExpiryDate) {
      return NextResponse.json({ error: "OTP has been expired" }, { status: 400 });
    }

    function generateToken() {
      const randomBytes = crypto.randomBytes(64).toString("hex");
      const timestamp = Date.now().toString();
      const combined = `${randomBytes}-${timestamp}`;
      return encryptData(combined);
    }

    const resetToken = generateToken();
    const resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    const response = NextResponse.json({
      message: "OTP verified successfully",
    });

    const expirationTimeInHours = 10;
    const expirationTimeInSeconds = expirationTimeInHours * 60;

    response.cookies.set("pqr", resetToken, {
      // httpOnly: true,
      // secure: true,
      // sameSite: "Strict",
      path: "/",
      maxAge: expirationTimeInSeconds,
    });
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      {
        status: 500,
      }
    );
  }
}
