import { NextResponse } from "next/server";
import { adminRoles } from "../../../helpers/constant";
import connectToDatabase from "../../../_database/mongodb";
import Announcements from "@/schemas/Announcements";
import Users from "@/schemas/Users";

export async function GET(request) {
  const loggedUserRole = request.headers.get("x-user-role");
  const loggedUserID = request.headers.get("x-user-id");

  // Pagination setup
  const currentPage =
    parseInt(request.nextUrl?.searchParams.get("page"), 10) || 1;
  const pageSize = Number(process.env.NEXT_PUBLIC_ITEM_PER_PAGE) || 10; // Fallback to default 10 if not set
  const skipCount = (currentPage - 1) * pageSize;

  // Determine roles based on user role
  const roles =
    loggedUserRole === "admin" || loggedUserRole === "superAdmin"
      ? adminRoles
      : loggedUserRole
      ? ["all", loggedUserRole]
      : ["all"];

  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch paginated announcements
    const announcements = await Announcements.find({
      studentCategory: { $in: roles },
    })
      .sort({ datetime: -1 }) // Sort by datetime (newest first)
      .limit(pageSize)
      .skip(skipCount)
      .select("message datetime createdAt"); // Only select required fields

    // Extract IDs from fetched announcements
    const announcementIds = announcements.map((announcement) => announcement._id);

    // Update the user's viewed announcements
    if (announcementIds.length > 0) {
      await Users.updateOne(
        { _id: loggedUserID },
        { $addToSet: { viewAnnouncements: { $each: announcementIds } } }
      );
    }

    // Return announcements and `hasMore` for pagination
    return NextResponse.json({
      announcements,
      hasMore: announcements.length === pageSize, // Indicates if there are more pages
    });
  } catch (error) {
    console.error("Error fetching announcements:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
