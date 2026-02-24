import { NextResponse } from "next/server";
import Channel from "../../../../schemas/Channel";
import connectToDatabase from "../../../../_database/mongodb";

export async function GET(request) {
  try {
    await connectToDatabase();

    const channels = await Channel.find({ isActive: true })
      .populate("creator", "username email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      channels,
    });
  } catch (error) {
    console.error("Error fetching channels:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch channels" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const loggedUserRole = request.headers.get("x-user-role");
    const userId = request.headers.get("x-user-id");

    if (loggedUserRole !== "admin" && loggedUserRole !== "superAdmin") {
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    const { name, description, educatorName, profilePicture } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Channel name is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingChannel = await Channel.findOne({ name });
    if (existingChannel) {
      return NextResponse.json(
        { error: "Channel with this name already exists" },
        { status: 400 }
      );
    }

    const newChannel = new Channel({
      name,
      description: description || "",
      educatorName: educatorName || null,
      profilePicture: profilePicture || null,
      creator: userId,
      videoCount: 0,
    });

    await newChannel.save();

    return NextResponse.json(
      {
        success: true,
        message: "Channel created successfully",
        channel: newChannel,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating channel:", error.message);
    return NextResponse.json(
      { error: "Failed to create channel" },
      { status: 500 }
    );
  }
}
