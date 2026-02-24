import { NextResponse } from "next/server";
import Notes from "../../../schemas/Notes";
import { adminRoles } from "../../../helpers/constant";
import connectToDatabase from "../../../_database/mongodb";

export async function GET(request) {
  const loggedUserRole = request.headers.get("x-user-role");
  const sortBy = request.nextUrl?.searchParams.get("sortBy") || "date";

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

    let query = { studentCategory: { $in: roles } };

    // Sorting logic based on `sortBy` value
    const sortOptions = {
      date: { notesCreatedAt: -1 },
      size: { pageCount: -1 },
      nameAsc: { title: 1 },
      nameDesc: { title: -1 },
    };

    const sortCriteria = sortOptions[sortBy] || sortOptions.date;

    const [notes, totalCount] = await Promise.all([
      Notes.find(query).sort(sortCriteria).skip(skipCount).limit(pageSize).lean(),
      Notes.countDocuments(query)
    ]);

    const newNotes = notes.map((val) => ({
      ...val,
      thumbnail: val.thumbnailFileName ? `${process.env.AWS_CLOUDFRONT_URL}/${val.thumbnailFileName}` : "",
      noteUrl: `${process.env.AWS_CLOUDFRONT_URL}/${val.noteFileName}`,
    }));

    return NextResponse.json(
      { notes: newNotes },
      {
        headers: {
          "x-current-page": currentPage,
          "x-total-pages": Math.ceil(totalCount / pageSize),
          "x-total-item": totalCount,
        },
      }
    );
  } catch (error) {
    console.error("Error fetching Notes:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
