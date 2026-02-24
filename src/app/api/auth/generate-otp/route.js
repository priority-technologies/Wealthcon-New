import connectToDatabase from "@/_database/mongodb";
import Users from "@/schemas/Users";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { sendEmailBySES } from "@/util/sendEmail";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
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

    const generateOtp = (length = 5) => {
      const randomBytes = crypto.randomBytes(Math.ceil(length / 2));
      const hexString = randomBytes.toString("hex");
      const otp = parseInt(hexString, 16).toString().slice(0, length);
      return otp.padStart(length, "0");
    };

    const otp = generateOtp();
    const hashOtp = await bcryptjs.hash(otp, 10);
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000); // OTP valid for 2 minutes

    user.otp = hashOtp;
    user.otpExpiry = otpExpiry;
    await user.save();

    const isEmailSent = await sendEmailBySES(email, otp);

    if (!isEmailSent) {
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "OTP sent successfully.",
        // otp,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      {
        status: 500,
      }
    );
  }
}
