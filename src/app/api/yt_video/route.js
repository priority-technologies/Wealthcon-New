import { NextResponse } from "next/server";
import connectToDatabase from "../../../_database/mongodb";
import { adminRoles } from "../../../helpers/constant";
import YoutubeVideos from "../../../schemas/Youtube";

export async function GET(request) {
    try {

        const loggedUserRole = request.headers.get("x-user-role");
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
        if (filterCategory && filterCategory !== "all" && filterCategory !== "null") {
            query.videoCategory = filterCategory;
        }

        const sortOptions = {
            date: { videoCreatedAt: -1 },
            size: { videoDuration: -1 },
            nameAsc: { title: 1 },
            nameDesc: { title: -1 },
        };

        const sortCriteria = sortOptions[sortBy] || sortOptions.date;

        const [videos, totalCount] = await Promise.all([
            YoutubeVideos.find(query).sort(sortCriteria).skip(skipCount).limit(pageSize).lean(),
            YoutubeVideos.countDocuments(query)
        ])

        return NextResponse.json(
            {
              videos,
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
        console.error("Error fetching YouTube videos:", error);
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}
  