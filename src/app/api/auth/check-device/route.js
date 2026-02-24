import { NextResponse } from "next/server";
import Sessions from "@/schemas/Sessions";
import connectToDatabase from "@/_database/mongodb";
import mongoose from "mongoose";

export async function GET(request) {
  const token = request.cookies.get("token")?.value || "";
  const userId = request.nextUrl?.searchParams.get("userId");
  try {
    await connectToDatabase();
    const checkDevice = await Sessions.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      token,
    }).select("token");
    return NextResponse.json(checkDevice);
  } catch (error) {
    console.error("Error checking device:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
