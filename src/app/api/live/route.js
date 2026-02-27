import connectToDatabase from "@/_database/mongodb";
import { NextResponse } from "next/server";
import Videos from "@/schemas/Videos";
import { adminRoles } from "@/helpers/constant";
import mongoose from "mongoose";

export async function GET(request) {
  try {
    // Require authentication for live sessions
    const loggedUserRole = request.headers.get("x-user-role");
    const loggedUserId = request.headers.get("x-user-id");

    if (!loggedUserId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const currentPage = parseInt(searchParams.get("page"), 10) || 1;
    const pageSize = Number(process.env.NEXT_PUBLIC_ITEM_PER_PAGE) || 10;
    const skipCount = (currentPage - 1) * pageSize;

    // Get role-based content access
    const roles =
      loggedUserRole === "admin" || loggedUserRole === "superAdmin"
        ? adminRoles
        : loggedUserRole
        ? ["all", loggedUserRole]
        : ["all"];

    // Fetch live session videos (videoCategory: "live")
    const [videos, totalCount] = await Promise.all([
      Videos.find({
        videoCategory: "live",
        studentCategory: { $in: roles },
      })
        .select("_id title description thumbnail videoDuration viewCount")
        .sort({ createdAt: -1 })
        .skip(skipCount)
        .limit(pageSize)
        .lean(),
      Videos.countDocuments({
        videoCategory: "live",
        studentCategory: { $in: roles },
      }),
    ]);

    return NextResponse.json({
      success: true,
      videos,
      totalCount,
      currentPage,
      totalPages: Math.ceil(totalCount / pageSize),
    });
  } catch (error) {
    console.error("Error fetching live sessions:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch live sessions" },
      { status: 500 }
    );
  }
}
