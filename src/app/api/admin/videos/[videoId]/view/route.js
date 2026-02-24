import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/_database/mongodb";
import Users from "@/schemas/Users";

export async function GET(request, { params }) {
  const { videoId } = params;
  const loggedUserId = request.headers.get("x-user-id");

  const currentPage =
    parseInt(request.nextUrl?.searchParams.get("page"), 10) || 1;
  const pageSize = Number(process.env.NEXT_PUBLIC_ITEM_PER_PAGE);
  const skipCount = (currentPage - 1) * pageSize;

  try {
    await connectToDatabase();

    // Validate videoId
    if (!videoId) {
      return NextResponse.json(
        { error: "Video ID is required" },
        { status: 400 }
      );
    }

    if (!mongoose.isValidObjectId(videoId)) {
      return NextResponse.json(
        { error: "Invalid video ID format" },
        { status: 400 }
      );
    }

    // Validate loggedUserId
    if (!loggedUserId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const videoObjectId = new mongoose.Types.ObjectId(videoId);

    const query = {
      viewVideos: videoObjectId,
      role: { $nin: ["admin", "superAdmin"] },
    };

    const [users, userCount] = await Promise.all([
      Users.find(query)
        .select("userId username email")
        .limit(pageSize)
        .skip(skipCount)
        .lean(),
      Users.countDocuments(query)
    ]);
    
    // Check if any users were found
    if (users.length === 0) {
      return NextResponse.json(
        { message: "No users have viewed this video." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      userCount,
      users,
      hasMore: users.length === pageSize,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
