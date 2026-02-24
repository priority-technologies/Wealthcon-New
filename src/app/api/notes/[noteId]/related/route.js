import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Notes from "@/schemas/Notes";
import { adminRoles } from "@/helpers/constant";
import connectToDatabase from "@/_database/mongodb";

export async function POST(request, { params }) {
  const { noteId } = params;
  const loggedUserRole = request.headers.get("x-user-role");
  const reqBody = await request.json();
  const noteTitle = reqBody?.title?.toLowerCase(); // Assuming title is part of request body

  const currentPage =
    parseInt(request.nextUrl?.searchParams.get("page"), 10) || 1;
  const pageSize = Number(process.env.NEXT_PUBLIC_ITEM_PER_PAGE);
  const skipCount = (currentPage - 1) * pageSize;

  try {
    if (!mongoose.isValidObjectId(noteId)) {
      return new NextResponse(JSON.stringify({ error: "Invalid note ID" }), {
        status: 400,
      });
    }

    await connectToDatabase();

    const objectId = new mongoose.Types.ObjectId(noteId);
    const roles =
      loggedUserRole === "admin" || loggedUserRole === "superAdmin"
        ? adminRoles
        : loggedUserRole
        ? ["all", loggedUserRole]
        : ["all"];

    const words = noteTitle
      .toLowerCase()
      .split(" ")
      .map((e) => e.trim())
      .filter(Boolean);

    const regexQueries = words.flatMap((word) => [
      { title: { $regex: word, $options: "i" } },
      { description: { $regex: word, $options: "i" } },
    ]);

    let relatedNotes = await Notes.find(
      {
        _id: { $ne: objectId },
        studentCategory: { $in: roles },
        $or: regexQueries,
      },
      {
        _id: 1,
        title: 1,
        description: 1,
        thumbnail: 1,
        notesCreatedAt: 1,
      }
    )
      .skip(skipCount)
      .limit(pageSize)
      .exec();

    // If no related notes were found, fetch 5 random notes
    if (relatedNotes.length === 0) {
      relatedNotes = await Notes.aggregate([
        { $match: { _id: { $ne: objectId }, studentCategory: { $in: roles } } },
        { $sample: { size: 5 } },
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            thumbnail: 1,
            notesCreatedAt: 1,
          },
        },
      ]).exec();
    }

    const totalCount = await Notes.countDocuments({
      _id: { $ne: objectId },
      studentCategory: { $in: roles },
      $or: regexQueries,
    }).exec();
    
    const newRelatedNotes = relatedNotes.map((val) => {
      const newVal = val.toObject();
      return ({
      ...newVal,
      thumbnail: newVal.thumbnailFileName
        ? `${process.env.AWS_CLOUDFRONT_URL}/${newVal.thumbnailFileName}`
        : "",
    })});

    return NextResponse.json(newRelatedNotes, {
      headers: {
        "x-current-page": currentPage,
        "x-total-pages": Math.ceil(totalCount / pageSize),
        "x-total-item": totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
