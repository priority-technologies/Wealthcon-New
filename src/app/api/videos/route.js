import { NextResponse } from "next/server";
import Videos from "../../../schemas/Videos";
import { adminRoles } from "../../../helpers/constant";
import connectToDatabase from "../../../_database/mongodb";
import watchHistory from "@/schemas/WatchHistory";
import mongoose from "mongoose";
import { minToSec } from "@/helpers/all";

export async function GET(request) {
  try {
    const loggedUserRole = request.headers.get("x-user-role");
    const userId = request.headers.get("x-user-id");

    const sortBy = request.nextUrl?.searchParams.get("sortBy") || "date";
    const filterCategory = request.nextUrl?.searchParams.get("category");
    const shorts = request.nextUrl?.searchParams.get("shorts") === "true";

    const currentPage =
      parseInt(request.nextUrl?.searchParams.get("page"), 10) || 1;
    const pageSize = Number(process.env.NEXT_PUBLIC_ITEM_PER_PAGE);
    const skipCount = (currentPage - 1) * pageSize;

    const roles =
      loggedUserRole === "admin" || loggedUserRole === "superAdmin"
        ? adminRoles
        : loggedUserRole
        ? ["all", loggedUserRole]
        : ["all"];

    await connectToDatabase();

    let query = { studentCategory: { $in: roles }, shorts };

    if (
      filterCategory &&
      filterCategory !== "all" &&
      filterCategory !== "null"
    ) {
      query.videoCategory = filterCategory;
    }

    // Sorting logic based on `sortBy` value
    const sortOptions = {
      date: { videoCreatedAt: -1 },
      size: { videoDuration: -1 },
      nameAsc: { title: 1 },
      nameDesc: { title: -1 },
    };

    const sortCriteria = sortOptions[sortBy] || sortOptions.date;

    const [videos, totalCount] = await Promise.all([
      Videos.find(query)
        .sort(sortCriteria)
        .skip(skipCount)
        .limit(pageSize)
        .lean(),
      Videos.countDocuments(query),
    ]);

    const videoIds = videos.map(
      (video) => new mongoose.Types.ObjectId(video._id)
    );
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

    const newVideos = videos.map((video) => {
      const history = historyMap.get(video._id.toString()) || null;
      let progress = history;
      if (history) {
        const total = minToSec(video?.videoDuration);
        const watched = minToSec(history?.watchedDuration);
        progress = (watched / total) * 100;
      }
      return {
        ...video,
        thumbnail: video.thumbnailFileName ? `/uploads/thumbnails/${video.thumbnailFileName}` : "",
        videoUrl: `/uploads/videos/${video.videoFileName}`,
        progress,
      };
    });

    return NextResponse.json(
      {
        videos: newVideos,
      },
      {
        headers: {
          "x-current-page": currentPage,
          "x-total-pages": Math.ceil(totalCount / pageSize),
          "x-total-item": totalCount,
        },
      }
    );
  } catch (error) {
    console.error("Error fetching videos:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch videos. Please try again later." },
      { status: 500 }
    );
  }
}
