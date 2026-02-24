import { NextResponse } from "next/server";
import createJWT from "../../../../JWT/createJWT";
import connectToDatabase from "../../../../_database/mongodb";
import Users from "../../../../schemas/Users";
import Sessions from "@/schemas/Sessions";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please provide both email and password" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await Users.findOne({ email, password });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json({ error: "User not active" }, { status: 403 });
    }

    const tokenData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    const token = createJWT(tokenData, "48h");

    await Sessions.updateOne(
      { userId: user._id },
      {
        $set: {
          token,
          lastLoginAt: new Date(),
        },
        $setOnInsert: {
          userId: user._id,
        },
      },
      { upsert: true }
    );

    const response = NextResponse.json({
      message: "Logged in successfully!",
      role: user.role,
    });

    const expirationTimeInHours = 48;
    const expirationTimeInSeconds = expirationTimeInHours * 60 * 60; // 1 hour = 60 minutes, 1 minute = 60 seconds

    response.cookies.set("token", token, {
      // httpOnly: true,
      // secure: true,
      // sameSite: "Strict",
      path: "/",
      maxAge: expirationTimeInSeconds,
    });
    return response;
  } catch (error) {
    console.error("Error during login:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
