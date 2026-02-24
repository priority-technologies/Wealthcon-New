import { NextResponse } from "next/server";
import watchHistory from "@/schemas/WatchHistory";
import connectToDatabase from "@/_database/mongodb";
import mongoose from "mongoose";
import Videos from "@/schemas/Videos";

export async function POST(request) {
  try {
    await connectToDatabase();
    const userId = request.headers.get("x-user-id");

    const { videoId, watchedDuration, videoDuration } = await request.json();
    const videoObjectId = new mongoose.Types.ObjectId(videoId);
    const isExistVideo = await Videos.findById(videoObjectId);

    if (!isExistVideo) {
      return new NextResponse(JSON.stringify({ error: "Video not found" }), {
        status: 404,
      });
    }

    if (
      (!isExistVideo?.videoDuration || isExistVideo.videoDuration === 0) &&
      videoDuration
    ) {
      await Videos.updateOne(
        { _id: isExistVideo._id },
        { $set: { videoDuration } }
      );
    }

    const history = await watchHistory.findOneAndUpdate(
      { userId, videoId },
      {
        watchedDuration,
        videoDuration: isExistVideo.videoDuration,
        lastWatchedAt: watchedDuration,
        updatedAt: new Date(),
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({ data: null });
  } catch (error) {
    console.error("Error fetching videos:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch videos. Please try again later." },
      { status: 500 }
    );
  }
}
