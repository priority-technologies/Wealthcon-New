import { NextResponse } from "next/server";
import Channel from "../../../../../schemas/Channel";
import Videos from "../../../../../schemas/Videos";
import connectToDatabase from "../../../../../_database/mongodb";
import mongoose from "mongoose";

export async function GET(request, { params: { channelId } }) {
  try {
    const loggedUserRole = request.headers.get("x-user-role");

    if (loggedUserRole !== "admin" && loggedUserRole !== "superAdmin") {
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const channel = await Channel.findById(channelId)
      .populate("creator", "username email")
      .lean();

    if (!channel) {
      return NextResponse.json(
        { error: "Channel not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      channel,
    });
  } catch (error) {
    console.error("Error fetching channel:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch channel" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params: { channelId } }) {
  try {
    const loggedUserRole = request.headers.get("x-user-role");

    if (loggedUserRole !== "admin" && loggedUserRole !== "superAdmin") {
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    const { name, description, educatorName, profilePicture } = await request.json();

    await connectToDatabase();

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return NextResponse.json(
        { error: "Channel not found" },
        { status: 404 }
      );
    }

    // Check if new name is already taken by another channel
    if (name && name !== channel.name) {
      const existingChannel = await Channel.findOne({ name });
      if (existingChannel) {
        return NextResponse.json(
          { error: "Channel name already in use" },
          { status: 400 }
        );
      }
    }

    if (name) channel.name = name;
    if (description !== undefined) channel.description = description;
    if (educatorName !== undefined) channel.educatorName = educatorName;
    if (profilePicture !== undefined) channel.profilePicture = profilePicture;

    await channel.save();

    return NextResponse.json({
      success: true,
      message: "Channel updated successfully",
      channel,
    });
  } catch (error) {
    console.error("Error updating channel:", error.message);
    return NextResponse.json(
      { error: "Failed to update channel" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params: { channelId } }) {
  try {
    const loggedUserRole = request.headers.get("x-user-role");

    if (loggedUserRole !== "admin" && loggedUserRole !== "superAdmin") {
      return NextResponse.json(
        { error: "Access denied. Admin only." },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const channel = await Channel.findById(channelId);
    if (!channel) {
      return NextResponse.json(
        { error: "Channel not found" },
        { status: 404 }
      );
    }

    // Check if channel has videos
    const videosInChannel = await Videos.countDocuments({
      channelId: new mongoose.Types.ObjectId(channelId),
    });

    if (videosInChannel > 0) {
      return NextResponse.json(
        { error: "Cannot delete channel with videos. Please remove videos first." },
        { status: 400 }
      );
    }

    // Soft delete - mark as inactive
    channel.isActive = false;
    await channel.save();

    return NextResponse.json({
      success: true,
      message: "Channel deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting channel:", error.message);
    return NextResponse.json(
      { error: "Failed to delete channel" },
      { status: 500 }
    );
  }
}
