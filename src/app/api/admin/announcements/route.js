import Announcements from "@/schemas/Announcements";
import connectToDatabase from "../../../../_database/mongodb";
import { NextResponse } from "next/server";
import { adminRoles } from "@/helpers/constant";

export async function GET(request) {
  const loggedUserRole = request.headers.get("x-user-role");

  const nextPage = parseInt(request.nextUrl?.searchParams.get("page"), 10) || 0;
  const pageSize = 100;
  const skipCount = nextPage * pageSize;

  const roles =
    loggedUserRole === "admin" || loggedUserRole === "superAdmin"
      ? adminRoles
      : loggedUserRole
      ? ["all", loggedUserRole]
      : ["all"];
  try {
    await connectToDatabase();
    const messages = await Announcements.find({
      studentCategory: { $in: roles },
    })
      .sort({ createdAt: -1 })
      // .limit(pageSize)
      // .skip(skipCount)
      .lean()
      .exec();

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching annoucement:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const loggedUserId = request.headers.get("x-user-id");
    const { message, studentCategory, datetime } = await request.json();

    if (!message || !studentCategory || !datetime) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectToDatabase();
    const newAnnouncements = new Announcements({
      message,
      studentCategory: JSON.parse(studentCategory),
      datetime,
      sender: loggedUserId ? loggedUserId : null,
    });
    const { _id } = await newAnnouncements.save();
    return NextResponse.json({ message: "Send message", insertId: _id });
  } catch (error) {
    console.error("Error while registering user:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
