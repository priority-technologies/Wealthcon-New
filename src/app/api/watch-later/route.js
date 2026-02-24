import { NextResponse } from "next/server";
import connectToDatabase from "../../../_database/mongodb";
import Users from "@/schemas/Users";
import mongoose from "mongoose";
import watchHistory from "@/schemas/WatchHistory";
import { minToSec } from "@/helpers/all";

export async function GET(request) {
  const loggedUserId = request.headers.get("x-user-id");
  const sortBy = request.nextUrl?.searchParams.get("sortBy");
  const filterCategory = request.nextUrl?.searchParams.get("category");

  const currentPage =
    parseInt(request.nextUrl?.searchParams.get("page"), 10) || 1;
  const pageSize = Number(process.env.NEXT_PUBLIC_ITEM_PER_PAGE);
  const skipCount = (currentPage - 1) * pageSize;

  if (!loggedUserId) {
    return NextResponse.json(
      { error: "User ID is required." },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    let options = {
      skip: skipCount,
      limit: pageSize,
    };
    if (sortBy) {
      options.sort = { [sortBy]: 1 };
    }
    if (filterCategory && filterCategory !== "null") {
      if (filterCategory !== "all") {
        options.match = { category: filterCategory };
      }
    }

    let opt = [];

    const filter =
      filterCategory && filterCategory !== "null" && filterCategory !== "all"
        ? { "savedLaterDetails.videoCategory": filterCategory }
        : {};

    if (sortBy) {
      opt.push({ $sort: { [`savedLaterDetails.${sortBy}`]: 1 } });
    }

    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(loggedUserId) } },
      { $unwind: "$savedLater" },
      {
        $lookup: {
          from: "videos",
          localField: "savedLater",
          foreignField: "_id",
          as: "savedLaterDetails",
        },
      },
      { $unwind: "$savedLaterDetails" },
      { $match: filter },
      {
        $facet: {
          totalCount: [{ $count: "total" }],
          paginatedResults: [
            {
              $project: {
                _id: "$savedLaterDetails._id",
                title: "$savedLaterDetails.title",
                description: "$savedLaterDetails.description",
                thumbnail: "$savedLaterDetails.thumbnail",
                thumbnailFileName: "$savedLaterDetails.thumbnailFileName",
                videoUrl: "$savedLaterDetails.videoUrl",
                videoFileName: "$savedLaterDetails.videoFileName",
                videoCreatedAt: "$savedLaterDetails.videoCreatedAt",
                videoDuration: "$savedLaterDetails.videoDuration",
              },
            },
            ...opt,
            { $skip: skipCount },
            { $limit: pageSize },
          ],
        },
      },
      {
        $project: {
          totalCount: {
            $ifNull: [{ $arrayElemAt: ["$totalCount.total", 0] }, 0],
          },
          paginatedResults: 1,
        },
      },
    ];
    const [result] = await Users.aggregate(pipeline);

    const videoIds = result.paginatedResults.map(
      (video) => new mongoose.Types.ObjectId(video._id)
    );
    const userHistories = loggedUserId
      ? await watchHistory
          .find({
            userId: new mongoose.Types.ObjectId(loggedUserId),
            videoId: { $in: videoIds },
          })
          .lean()
      : [];

    const historyMap = new Map();
    userHistories.forEach((entry) => {
      historyMap.set(entry.videoId.toString(), entry);
    });

    const newVideos = result.paginatedResults.map((video) => {
      const history = historyMap.get(video._id.toString()) || null;
      let progress = history;
      if (history) {
        const total = minToSec(video?.videoDuration);
        const watched = minToSec(history?.watchedDuration);
        progress = (watched / total) * 100;
      }
      return {
        ...video,
        thumbnail: video.thumbnailFileName
          ? `${process.env.AWS_CLOUDFRONT_URL}/${video.thumbnailFileName}`
          : "",
        videoUrl: `${process.env.AWS_CLOUDFRONT_URL}/${video.videoFileName}`,
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
          "x-total-pages": Math.ceil((result?.totalCount || 0) / pageSize),
          "x-total-item": result?.totalCount || 0,
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

export async function POST(request) {
  const loggedUserId = request.headers.get("x-user-id");

  if (!loggedUserId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const { videoId, action } = await request.json();
  let updateQuery = "";

  if (!videoId) {
    return NextResponse.json(
      { error: "Please provide a video ID" },
      { status: 400 }
    );
  }

  try {
    await connectToDatabase();

    if (action === "add") {
      updateQuery = { $addToSet: { savedLater: videoId } };
    } else if (action === "remove") {
      updateQuery = { $pull: { savedLater: videoId } };
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    await Users.updateOne({ _id: loggedUserId }, updateQuery);

    return NextResponse.json({
      message: `Video ${
        action === "add" ? "added" : "remove"
      } to saved list successfully`,
    });
  } catch (error) {
    console.error("Error adding video to saved list:", error.message);
    return NextResponse.json(
      { error: "Failed to add video to saved list. Please try again later." },
      { status: 500 }
    );
  }
}
