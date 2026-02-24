import { NextResponse } from "next/server";
import { adminRoles } from "../../../helpers/constant";
import connectToDatabase from "../../../_database/mongodb";
import Messages from "../../../schemas/Messages";
import Users from "@/schemas/Users";

export async function GET(request) {
  const loggedUserRole = request.headers.get("x-user-role");
  const loggedUserID = request.headers.get("x-user-id");

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

    const messages = await Messages.find({ studentCategory: { $in: roles } })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(skipCount);

    const messageIds = messages.map((msg) => msg._id);

    await Users.updateOne(
      { _id: loggedUserID },
      { $addToSet: { viewMessages: { $each: messageIds } } }
    );

    return NextResponse.json({
      messages,
      hasMore: messages.length === pageSize,
    });
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
