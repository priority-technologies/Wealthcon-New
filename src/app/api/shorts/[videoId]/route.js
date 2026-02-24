import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "../../../../_database/mongodb";
import Users from "@/schemas/Users";
import Videos from "@/schemas/Videos";

export async function GET(request, { params }) {
  const { videoId } = params;
  const loggedUserId = request.headers.get("x-user-id");

  try {
    if (!mongoose.isValidObjectId(videoId)) {
      return new NextResponse(JSON.stringify({ error: "Invalid video ID" }), {
        status: 400,
      });
    }

    await connectToDatabase();
    const videoObjectId = new mongoose.Types.ObjectId(videoId);
    const userObjectId = new mongoose.Types.ObjectId(loggedUserId);

    const [video, userData] = await Promise.all([
      Videos.findById(videoObjectId),
      Users.aggregate([
        { $match: { _id: userObjectId } },
        {
          $project: {
            savedLater: {
              $in: [videoObjectId, { $ifNull: ["$savedLater", []] }],
            },
            viewVideos: {
              $in: [videoObjectId, { $ifNull: ["$viewVideos", []] }],
            },
          },
        },
      ]),
    ]);

    if (!video) {
      return new NextResponse(JSON.stringify({ error: "Video not found" }), {
        status: 404,
      });
    }

    const userInfo = userData[0] || {};
    const savedLater = userInfo.savedLater || false;
    const alreadyViewed = userInfo.viewVideos || false;

    if (!alreadyViewed) {
      await Users.updateOne(
        { _id: userObjectId },
        { $addToSet: { viewVideos: videoObjectId } }
      );
    }

    const newVideo = video.toObject();
    return NextResponse.json({
      ...newVideo,
      thumbnail: newVideo.thumbnailFileName
        ? `${process.env.AWS_CLOUDFRONT_URL}/${newVideo.thumbnailFileName}`
        : "",
      videoUrl: `${process.env.AWS_CLOUDFRONT_URL}/${newVideo.videoFileName}`,
      savedLater,
    });
  } catch (error) {
    console.error("Error fetching video:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
