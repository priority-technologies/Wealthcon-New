import { NextResponse } from "next/server";
import VideoRanking from "../../../schemas/VideoRanking";
import Videos from "../../../schemas/Videos";
import Channel from "../../../schemas/Channel";
import connectToDatabase from "../../../_database/mongodb";
import watchHistory from "@/schemas/WatchHistory";
import mongoose from "mongoose";
import { minToSec } from "@/helpers/all";

export async function GET(request) {
  try {
    const loggedUserRole = request.headers.get("x-user-role");
    const userId = request.headers.get("x-user-id");
    const channelId = request.nextUrl?.searchParams.get("channelId");
    const category = request.nextUrl?.searchParams.get("category");

    await connectToDatabase();

    // Build query
    let query = {};
    if (channelId) {
      query.channelId = new mongoose.Types.ObjectId(channelId);
    }
    if (category) {
      query.studentCategory = category;
    }

    // Get trending rankings
    const rankings = await VideoRanking.find(query)
      .populate({
        path: "videoId",
        select: "title description thumbnail videoUrl videoFileName thumbnailFileName videoDuration",
      })
      .sort({ rank: 1 })
      .lean();

    if (!rankings || rankings.length === 0) {
      return NextResponse.json({
        success: true,
        trending: [],
        message: "No trending videos available",
      });
    }

    // Get video IDs for watch history lookup
    const videoIds = rankings
      .map((r) => r.videoId?._id)
      .filter((id) => id);

    // Get watch history for user
    const userHistories = userId
      ? await watchHistory
          .find({
            userId: new mongoose.Types.ObjectId(userId),
            videoId: { $in: videoIds },
          })
          .lean()
      : [];

    const historyMap = new Map();
    userHistories.forEach((entry) => {
      historyMap.set(entry.videoId.toString(), entry);
    });

    // Enrich with progress and cloud URLs
    const trendingVideos = rankings.map((ranking) => {
      const video = ranking.videoId;
      const history = historyMap.get(video._id.toString()) || null;
      let progress = 0;

      if (history) {
        const total = minToSec(video?.videoDuration);
        const watched = minToSec(history?.watchedDuration);
        progress = (watched / total) * 100;
      }

      return {
        id: video._id,
        rank: ranking.rank,
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnailFileName
          ? `${process.env.AWS_CLOUDFRONT_URL}/${video.thumbnailFileName}`
          : "",
        videoUrl: `${process.env.AWS_CLOUDFRONT_URL}/${video.videoFileName}`,
        videoDuration: video.videoDuration,
        watchPercentage: progress,
        viewCount: ranking.viewCount,
      };
    });

    return NextResponse.json({
      success: true,
      trending: trendingVideos,
      total: trendingVideos.length,
    });
  } catch (error) {
    console.error("Error fetching trending videos:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch trending videos" },
      { status: 500 }
    );
  }
}
