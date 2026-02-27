export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import BgImage from "@/schemas/BgImage";
import connectToDatabase from "@/_database/mongodb";

export async function GET(request) {
  try {
    // Require authentication
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const images = await BgImage.find()
      .select("filename")
      .sort({ createdAt: -1 })
      .limit(1);

    return NextResponse.json({
      success: true,
      imageUrl: `/uploads/bg-images/${images?.[0]?.filename}`,
    });
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
