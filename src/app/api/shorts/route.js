import { NextResponse } from "next/server";

import Videos from "@/schemas/Videos";
import connectToDatabase from "@/_database/mongodb";
import { adminRoles } from "@/helpers/constant";

export async function GET(request) {
  try {
    const loggedUserRole = request.headers.get("x-user-role");
    const sortBy = request.nextUrl?.searchParams.get("sortBy") || "date";
    const filterCategory = request.nextUrl?.searchParams.get("category");

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

    let query = { studentCategory: { $in: roles }, shorts: true };

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

    const newVideo = videos.map((val) => ({
      ...val,
      thumbnail: val.thumbnailFileName
        ? `${process.env.AWS_CLOUDFRONT_URL}/${val.thumbnailFileName}`
        : "",
      videoUrl: `${process.env.AWS_CLOUDFRONT_URL}/${val.videoFileName}`,
    }));

    return NextResponse.json(
      {
        videos: newVideo,
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
