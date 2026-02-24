import { NextResponse } from "next/server";
import connectToDatabase from "../../../_database/mongodb";
import Announcements from "@/schemas/Announcements";
import { adminRoles } from "@/helpers/constant";

export async function GET(request) {
  const loggedUserRole = request.headers.get("x-user-role");

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

  try {
    await connectToDatabase();

    // Delete old announcements
    // await Announcements.deleteMany({ datetime: { $lt: new Date() } });

    // For other roles, filter announcements based on their role
    const announcements = await Announcements.find({
      studentCategory: { $in: roles },
      // datetime: { $gte: new Date() },
    })
      .select("message datetime studentCategory createdAt")
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(skipCount);

    return NextResponse.json({
      announcements,
      hasMore: announcements.length === pageSize,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
