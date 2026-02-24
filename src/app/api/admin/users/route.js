import connectToDatabase from "../../../../_database/mongodb";
import Users from "../../../../schemas/Users";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const loggedUserRole = request.headers.get("x-user-role");

    // Check if the user has proper access
    if (loggedUserRole !== "admin" && loggedUserRole !== "superAdmin") {
      return NextResponse.json({ message: "Access denied" }, { status: 401 });
    }

    const sortBy = request.nextUrl?.searchParams.get("sortBy");
    const filterCategory = request.nextUrl?.searchParams.get("category");
    const searchTerm = request.nextUrl?.searchParams.get("search") || "";

    const currentPage =
      parseInt(request.nextUrl?.searchParams.get("page"), 10) || 1;
    const pageSize = Number(process.env.NEXT_PUBLIC_ITEM_PER_PAGE);
    const skipCount = (currentPage - 1) * pageSize;

    await connectToDatabase();

    let query = { role: { $ne: "superAdmin" } };

    // Apply category filter if provided
    if (filterCategory && filterCategory !== "null") {
      query.role = filterCategory;
    }

    // Apply search filter (for name, email, or mobile number)
    if (searchTerm) {
      query.$or = [
        { userId: { $regex: searchTerm, $options: "i" } },
        { name: { $regex: searchTerm, $options: "i" } },
        { email: { $regex: searchTerm, $options: "i" } },
      ];
    }

    let queryBuilder = Users.find(query)
      .select("-createdAt -__v -lastLoginAt")
      .lean()
      .skip(skipCount)
      .limit(pageSize);

    // Apply sorting
    const sortFilter = sortBy === "name" ? "name" : "createdAt";
    queryBuilder = queryBuilder.sort({ [sortFilter]: 1 });

    const users = await queryBuilder.exec();
    const totalCount = await Users.countDocuments(query);

    return NextResponse.json(users, {
      headers: {
        "x-current-page": currentPage,
        "x-total-pages": Math.ceil(totalCount / pageSize),
        "x-total-item": totalCount,
      },
    });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// old code without search

// import connectToDatabase from "../../../../_database/mongodb";
// import Users from "../../../../schemas/Users";
// import { NextResponse } from "next/server";

// export async function GET(request) {
//   try {
//     const loggedUserRole = request.headers.get("x-user-role");

//     // Check if the user has proper access
//     if (loggedUserRole !== 'admin' && loggedUserRole !== 'superAdmin') {
//       return NextResponse.json(
//         { message: "Access denied" },
//         { status: 401 }
//       );
//     }

//     const sortBy = request.nextUrl?.searchParams.get("sortBy");
//     const filterCategory = request.nextUrl?.searchParams.get("category");

//     const currentPage =
//       parseInt(request.nextUrl?.searchParams.get("page"), 10) || 1;
//     const pageSize = Number(process.env.NEXT_PUBLIC_ITEM_PER_PAGE);
//     const skipCount = (currentPage - 1) * pageSize;

//     await connectToDatabase();

//     let query = { role: { $ne: 'superAdmin' } };

//     if (filterCategory && filterCategory !== "null") {
//       query.role = filterCategory;
//     }

//     let queryBuilder = Users.find(query)
//       .select("-createdAt -__v -lastLoginAt")
//       .lean()
//       .skip(skipCount)
//       .limit(pageSize);

//     // if (sortBy) {
//     const sortFilter =
//       sortBy === "name" ? "name" : "userId";
//     queryBuilder = queryBuilder.sort({ [sortFilter]: 1 });
//     // }

//     const users = await queryBuilder.exec();
//     const totalCount = await Users.countDocuments(query);

//     return NextResponse.json(users, {
//       headers: {
//         "x-current-page": currentPage,
//         "x-total-pages": Math.ceil(totalCount / pageSize),
//         "x-total-item": totalCount,
//       },
//     });
//   } catch (error) {
//     console.error(error.message);
//     return NextResponse.json(
//       { error: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
