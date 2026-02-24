import { adminRoles } from "../../../helpers/constant";
import Notes from "../../../schemas/Notes";
import Videos from "../../../schemas/Videos";
import Gallary from "../../../schemas/Gallary";
import { NextResponse } from "next/server";

function getFifthDate() {
  const today = new Date();
  const fifthDate = new Date(today);

  fifthDate.setDate(today.getDate() - 4);
  return fifthDate.toISOString().split("T")[0];
}

const fetchData = async (model, query, projection, limit = 5) => {
  // Add index hinting if needed
  return model.find(query, projection).limit(limit).lean().exec(); // Using lean() to skip mongoose document construction
};

export async function GET(request) {
  const loggedUserRole = request.headers.get("x-user-role");
  try {
    const date = getFifthDate();
    const roles =
      loggedUserRole === "admin" || loggedUserRole === "superAdmin"
        ? adminRoles
        : loggedUserRole
        ? ["all", loggedUserRole]
        : ["all"];

    const videoQuery = {
      studentCategory: { $in: roles },
      videoCreatedAt: { $gte: date },
    };

    const notesQuery = {
      studentCategory: { $in: roles },
      notesCreatedAt: { $gte: date },
    };

    const galleryQuery = {
      studentCategory: { $in: roles },
      imageCreatedAt: { $gte: date },
    };

    const projection = {
      _id: 1,
      title: 1
    };

    // Fetch data in parallel
    const [videos, notes, gallery] = await Promise.all([
      fetchData(Videos, videoQuery, { ...projection, videoCreatedAt: 1 }),
      fetchData(Notes, notesQuery, { ...projection, notesCreatedAt: 1 }),
      fetchData(Gallary, galleryQuery, { ...projection, imageCreatedAt: 1 }),
    ]);

    // Combine results
    const allData = {
      videos,
      notes,
      gallery,
    };

    return NextResponse.json(allData);
  } catch (error) {
    console.error("Error while processing search:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
