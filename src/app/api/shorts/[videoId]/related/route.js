import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Videos from "../../../../../schemas/Videos";
import { adminRoles } from "../../../../../helpers/constant";
import connectToDatabase from "../../../../../_database/mongodb";

export async function POST(request, { params }) {
  const { videoId } = params;
  const loggedUserRole = request.headers.get("x-user-role");
  const reqBody = await request.json();
  const videoTitle = reqBody?.title?.toLowerCase();

  const currentPage =
    parseInt(request.nextUrl?.searchParams.get("page"), 10) || 1;
  const pageSize = Number(process.env.NEXT_PUBLIC_ITEM_PER_PAGE);
  const skipCount = (currentPage - 1) * pageSize;

  try {
    if (!mongoose.isValidObjectId(videoId)) {
      return new NextResponse(JSON.stringify({ error: "Invalid video ID" }), {
        status: 400,
      });
    }

    await connectToDatabase();

    const objectId = new mongoose.Types.ObjectId(videoId);
    const roles =
      loggedUserRole === "admin" || loggedUserRole === "superAdmin"
        ? adminRoles
        : loggedUserRole
        ? ["all", loggedUserRole]
        : ["all"];

    let relatedVideos = await Videos.find(
      {
        _id: { $ne: objectId },
        studentCategory: { $in: roles },
        // shorts: true,
      },
      {
        _id: 1,
        title: 1,
        description: 1,
        thumbnail: 1,
        videoCreatedAt: 1,
      }
    )
      .skip(skipCount)
      .limit(pageSize)
      .exec();

    const totalCount = await Videos.countDocuments({
      _id: { $ne: objectId },
      studentCategory: { $in: roles },
      shorts: true,
    }).exec();
    
    const newRelatedVideo = relatedVideos.map((val) => {
      const newVal = val.toObject();
      return ({
      ...newVal,
      thumbnail: newVal.thumbnailFileName
        ? `${process.env.AWS_CLOUDFRONT_URL}/${newVal.thumbnailFileName}`
        : "",
    })});

    return NextResponse.json(newRelatedVideo, {
      headers: {
        "x-current-page": currentPage,
        "x-total-pages": Math.ceil(totalCount / pageSize),
        "x-total-item": totalCount,
      },
    });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500 }
    );
  }
}

// Related videos api

// export async function POST(request, { params }) {
//   const { videoId } = params;
//   const loggedUserRole = request.headers.get("x-user-role");
//   const reqBody = await request.json();
//   const videoTitle = reqBody?.title?.toLowerCase();

//   const currentPage =
//     parseInt(request.nextUrl?.searchParams.get("page"), 10) || 1;
//   const pageSize = Number(process.env.NEXT_PUBLIC_ITEM_PER_PAGE);
//   const skipCount = (currentPage - 1) * pageSize;

//   try {
//     if (!mongoose.isValidObjectId(videoId)) {
//       return new NextResponse(JSON.stringify({ error: "Invalid video ID" }), {
//         status: 400,
//       });
//     }

//     await connectToDatabase();

//     const objectId = new mongoose.Types.ObjectId(videoId);
//     const roles =
//       loggedUserRole === "admin" || loggedUserRole === "superAdmin"
//         ? adminRoles
//         : loggedUserRole
//           ? ["all", loggedUserRole]
//           : ["all"];

//     const words = videoTitle
//       .toLowerCase()
//       .split(" ")
//       .map((e) => e.trim())
//       .filter(Boolean);

//     const regexQueries = words.flatMap((word) => [
//       { title: { $regex: word, $options: "i" } },
//       { description: { $regex: word, $options: "i" } },
//     ]);

//     let relatedVideos = await Videos.find(
//       {
//         _id: { $ne: objectId },
//         studentCategory: { $in: roles },
//         $or: regexQueries,
//       },
//       {
//         _id: 1,
//         title: 1,
//         description: 1,
//         thumbnail: 1,
//         videoCreatedAt: 1,
//       }
//     ).skip(skipCount)
//       .limit(pageSize)
//       .exec();

//     // If no related videos were found, fetch 5 random videos
//     if (relatedVideos.length === 0) {
//       relatedVideos = await Videos.aggregate([
//         { $match: { _id: { $ne: objectId }, studentCategory: { $in: roles } } },
//         { $sample: { size: 5 } },
//         { $project: { _id: 1, title: 1, description: 1, thumbnail: 1, videoCreatedAt: 1 } }
//       ]).exec();
//     }

//     const totalCount = await Videos.countDocuments({
//       _id: { $ne: objectId },
//       studentCategory: { $in: roles },
//       $or: regexQueries,
//     }).exec();

//     return NextResponse.json(relatedVideos, {
//       headers: {
//         "x-current-page": currentPage,
//         "x-total-pages": Math.ceil(totalCount / pageSize),
//         "x-total-item": totalCount,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching video:", error);
//     return new NextResponse(
//       JSON.stringify({ error: "Internal server error" }),
//       { status: 500 }
//     );
//   }
// }
