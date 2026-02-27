import { NextResponse } from "next/server";
import Channel from "../../../schemas/Channel";
import connectToDatabase from "../../../_database/mongodb";

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

    const channels = await Channel.find({ isActive: true })
      .select("_id name description videoCount educatorName")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      channels,
    });
  } catch (error) {
    console.error("Error fetching channels:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch channels" },
      { status: 500 }
    );
  }
}
