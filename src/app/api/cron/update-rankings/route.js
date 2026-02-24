import { NextResponse } from "next/server";
import Videos from "../../../../schemas/Videos";
import Channel from "../../../../schemas/Channel";
import VideoRanking from "../../../../schemas/VideoRanking";
import connectToDatabase from "../../../../_database/mongodb";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    // Verify the request is from Vercel Cron or authorized source
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get all active channels
    const channels = await Channel.find({ isActive: true }).lean();

    let totalRankingsUpdated = 0;

    for (const channel of channels) {
      // Get all unique student categories
      const categoriesResult = await Videos.distinct("studentCategory", {
        channelId: channel._id,
      });

      for (const category of categoriesResult) {
        // Get top 10 videos in this channel and category, sorted by viewCount
        const topVideos = await Videos.find({
          channelId: channel._id,
          studentCategory: category,
        })
          .sort({ viewCount: -1 })
          .limit(10)
          .select("_id viewCount")
          .lean();

        // Delete existing rankings for this channel-category combination
        await VideoRanking.deleteMany({
          channelId: channel._id,
          studentCategory: category,
        });

        // Create new rankings
        const rankings = topVideos.map((video, index) => ({
          videoId: video._id,
          channelId: channel._id,
          studentCategory: category,
          rank: index + 1,
          viewCount: video.viewCount,
          lastUpdatedAt: new Date(),
        }));

        await VideoRanking.insertMany(rankings);

        totalRankingsUpdated += rankings.length;
      }
    }

    console.log(`Rankings cron executed: ${totalRankingsUpdated} rankings updated`);

    return NextResponse.json({
      success: true,
      message: `Rankings updated successfully. ${totalRankingsUpdated} total rankings processed`,
      channelsProcessed: channels.length,
    });
  } catch (error) {
    console.error("Error in rankings cron:", error.message);
    return NextResponse.json(
      { error: "Rankings update failed", details: error.message },
      { status: 500 }
    );
  }
}

// Vercel Cron Configuration
export const maxDuration = 120; // 2 minutes timeout for complex processing
