import { NextResponse } from "next/server";
import Videos from "../../../../schemas/Videos";
import Channel from "../../../../schemas/Channel";
import { adminRoles } from "../../../../helpers/constant";
import connectToDatabase from "../../../../_database/mongodb";
import watchHistory from "@/schemas/WatchHistory";
import mongoose from "mongoose";
import { minToSec } from "@/helpers/all";

async function enrichVideosWithProgress(videos, userId) {
  if (!videos || videos.length === 0) return videos;

  const videoIds = videos.map((video) => new mongoose.Types.ObjectId(video._id));
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

  return videos.map((video) => {
    const history = historyMap.get(video._id.toString()) || null;
    let progress = 0;
    if (history) {
      const total = minToSec(video?.videoDuration);
      const watched = minToSec(history?.watchedDuration);
      progress = (watched / total) * 100;
    }
    return {
      ...video,
      watchPercentage: progress,
      thumbnail: video.thumbnail || "",
      videoUrl: `${process.env.AWS_CLOUDFRONT_URL}/${video.videoFileName}`,
    };
  });
}

export async function GET(request) {
  try {
    const loggedUserRole = request.headers.get("x-user-role");
    const userId = request.headers.get("x-user-id");

    const roles =
      loggedUserRole === "admin" || loggedUserRole === "superAdmin"
        ? adminRoles
        : loggedUserRole
        ? ["all", loggedUserRole]
        : ["all"];

    await connectToDatabase();

    const baseQuery = { studentCategory: { $in: roles }, shorts: false };

    // Fetch videos for different categories
    const [recentlyAdded, liveSessionVideos, assignmentVideos, topWebinars] =
      await Promise.all([
        // Recently Added - latest videos (all categories)
        Videos.find(baseQuery)
          .sort({ videoCreatedAt: -1 })
          .limit(8)
          .lean(),
        // Live Sessions - videos with videoCategory "live"
        Videos.find({ ...baseQuery, videoCategory: "live" })
          .sort({ videoCreatedAt: -1 })
          .limit(8)
          .lean(),
        // Assignments - videos with videoCategory "assignment"
        Videos.find({ ...baseQuery, videoCategory: "assignment" })
          .sort({ videoCreatedAt: -1 })
          .limit(8)
          .lean(),
        // Top Webinars - most viewed videos
        Videos.find(baseQuery)
          .sort({ viewCount: -1 })
          .limit(8)
          .lean(),
      ]);

    // Get featured content (latest video from channel with most videos)
    let featured = null;
    try {
      // Find the active channel with the most videos
      const channelsWithCounts = await Channel.aggregate([
        { $match: { isActive: true } },
        {
          $lookup: {
            from: "videos",
            localField: "_id",
            foreignField: "channelId",
            as: "videos",
          },
        },
        { $addFields: { videoCount: { $size: "$videos" } } },
        { $sort: { videoCount: -1 } },
        { $limit: 1 },
      ]);

      if (channelsWithCounts.length > 0) {
        const topChannel = channelsWithCounts[0];
        featured = await Videos.findOne({
          ...baseQuery,
          channelId: topChannel._id,
        })
          .sort({ videoCreatedAt: -1 })
          .lean();
      }

      // Fallback to most recent video if no channel found
      if (!featured) {
        featured = await Videos.findOne(baseQuery)
          .sort({ videoCreatedAt: -1 })
          .lean();
      }
    } catch (err) {
      console.error("Error finding featured channel:", err);
      featured = await Videos.findOne(baseQuery)
        .sort({ videoCreatedAt: -1 })
        .lean();
    }

    // Enrich all videos with progress info
    const [enrichedFeatured, enrichedRecent, enrichedLive, enrichedAssignment, enrichedTop] =
      await Promise.all([
        featured ? enrichVideosWithProgress([featured], userId) : [],
        enrichVideosWithProgress(recentlyAdded, userId),
        enrichVideosWithProgress(liveSessionVideos, userId),
        enrichVideosWithProgress(assignmentVideos, userId),
        enrichVideosWithProgress(topWebinars, userId),
      ]);

    return NextResponse.json({
      featured: enrichedFeatured[0] || null,
      categories: [
        { id: "recently-added", title: "Recently Added", videos: enrichedRecent },
        { id: "live-sessions", title: "Live Sessions", videos: enrichedLive },
        { id: "assignments", title: "Assignments", videos: enrichedAssignment },
        { id: "top-webinars", title: "Top Webinars", videos: enrichedTop },
      ],
    });
  } catch (error) {
    console.error("Error fetching video categories:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch video categories. Please try again later." },
      { status: 500 }
    );
  }
}
