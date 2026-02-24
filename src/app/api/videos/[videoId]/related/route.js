import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Videos from "../../../../../schemas/Videos";
import { adminRoles } from "../../../../../helpers/constant";
import connectToDatabase from "../../../../../_database/mongodb";

export async function GET(request, { params }) {
  const { videoId } = params;
  const loggedUserRole = request.headers.get("x-user-role");

  try {
    if (!mongoose.isValidObjectId(videoId)) {
      return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
    }

    await connectToDatabase();

    const objectId = new mongoose.Types.ObjectId(videoId);
    const roles =
      loggedUserRole === "admin" || loggedUserRole === "superAdmin"
        ? adminRoles
        : loggedUserRole
        ? ["all", loggedUserRole]
        : ["all"];

    // Get the current video to find its channel
    const currentVideo = await Videos.findById(objectId)
      .select("channelId")
      .lean();

    if (!currentVideo) {
      return NextResponse.json({ videos: [] });
    }

    // Fetch videos from the same channel (limit to 5)
    let relatedVideos = [];

    if (currentVideo.channelId) {
      relatedVideos = await Videos.find(
        {
          _id: { $ne: objectId },
          channelId: currentVideo.channelId,
          studentCategory: { $in: roles },
        },
        {
          _id: 1,
          title: 1,
          description: 1,
          thumbnail: 1,
          videoCreatedAt: 1,
        }
      )
        .sort({ videoCreatedAt: -1 })
        .limit(5)
        .lean();
    }

    // If no videos from same channel, return empty (don't show random videos)
    return NextResponse.json({ videos: relatedVideos });
  } catch (error) {
    console.error("Error fetching related videos:", error.message);
    return NextResponse.json({ videos: [] }, { status: 500 });
  }
}
