import { NextResponse } from "next/server";
import Quote from "@/schemas/Quotes";
import connectToDatabase from "@/_database/mongodb";

export async function GET(request) {
  try {
    // Require authentication
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const currentPage =
      parseInt(request.nextUrl?.searchParams.get("page"), 10) || 1;
    const pageSize = Number(process.env.NEXT_PUBLIC_ITEM_PER_PAGE);
    const skipCount = (currentPage - 1) * pageSize;

    await connectToDatabase();

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [deletedResult, totalCount, quotes] = await Promise.all([
      Quote.deleteMany({ createdAt: { $lt: twentyFourHoursAgo } }),
      Quote.countDocuments(),
      Quote.find({ createdAt: { $gte: twentyFourHoursAgo } })
        .sort({
          createdAt: -1,
        })
        .select("image createdAt")
        .skip(skipCount)
        .limit(pageSize),
    ]);

    return NextResponse.json(
      { quotes },
      {
        headers: {
          "x-current-page": currentPage,
          "x-total-pages": Math.ceil(totalCount / pageSize),
          "x-total-item": totalCount,
        },
      }
    );
  } catch (error) {
    console.error("Error fetching or deleting quotes:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
