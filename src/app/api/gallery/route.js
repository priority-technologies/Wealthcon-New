import { NextResponse } from "next/server";
import Gallary from "../../../schemas/Gallary";
import { adminRoles } from "../../../helpers/constant";

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
    let query = { studentCategory: { $in: roles } };

    // Sorting logic based on `sortBy` value
    const sortOptions = {
      date: { imageCreatedAt: -1 },
      nameAsc: { title: 1 },
      nameDesc: { title: -1 },
    };

    const sortCriteria = sortOptions[sortBy] || sortOptions.date;

    const [gallery, totalCount] = await Promise.all([
      Gallary.find(query).sort(sortCriteria).skip(skipCount).limit(pageSize).lean(),
      Gallary.countDocuments(query)
    ]);

    const newGallery = gallery.map(val=>({
      ...val,
      image: `${process.env.AWS_CLOUDFRONT_URL}/${val.imageFileName}`
    }))
    return NextResponse.json(
      { gallery: newGallery },
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
