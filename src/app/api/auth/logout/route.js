import { NextResponse } from "next/server";
import connectToDatabase from "../../../../_database/mongodb";
import Sessions from "@/schemas/Sessions";

export async function GET(request) {
  try {
    const loggedUserId = request.headers.get("x-user-id");
    await connectToDatabase();
    await Sessions.findOneAndUpdate(
      { userId: loggedUserId },
      { $set: { token: "", lastLoginAt: Date.now() } }
    );

    const response = NextResponse.json({
      message: "Logout successfull",
    });

    // Remove the token from cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || "Something went wrong!",
      },
      {
        status: 500,
      }
    );
  }
}
