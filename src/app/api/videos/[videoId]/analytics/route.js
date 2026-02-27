import { NextResponse } from "next/server";
import connectToDatabase from "@/_database/mongodb";
import WatchHistory from "@/schemas/WatchHistory";
import Users from "@/schemas/Users";
import mongoose from "mongoose";

export async function GET(request, { params: { videoId } }) {
  try {
    // Check authorization - only admins can view analytics
    const userRole = request.headers.get("x-user-role");

    if (userRole !== "admin" && userRole !== "superAdmin") {
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Get all watch history entries for this video
    const watchHistories = await WatchHistory.find({
      videoId: new mongoose.Types.ObjectId(videoId),
    })
      .populate("userId", "username email profilePicture")
      .lean();

    // Count total unique views
    const uniqueViewers = new Set(watchHistories.map(w => w.userId?._id?.toString()));
    const viewCount = uniqueViewers.size;

    // Get detailed viewer information
    const viewers = [];
    const seenUserIds = new Set();

    for (const entry of watchHistories) {
      if (entry.userId && !seenUserIds.has(entry.userId._id.toString())) {
        seenUserIds.add(entry.userId._id.toString());
        viewers.push({
          id: entry.userId._id,
          username: entry.userId.username || "Unknown User",
          email: entry.userId.email || "No email",
          profilePicture: entry.userId.profilePicture || null,
          watchedAt: entry.createdAt || entry.lastWatchedAt,
          watchedDuration: entry.watchedDuration || 0,
        });
      }
    }

    return NextResponse.json({
      success: true,
      viewCount,
      viewers,
      totalEntries: watchHistories.length,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics", success: false },
      { status: 500 }
    );
  }
}
