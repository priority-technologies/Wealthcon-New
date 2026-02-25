export const maxDuration = 60;

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import connectToDatabase from "@/_database/mongodb";
import BgImage from "@/schemas/BgImage";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const imageType = formData.get("imageType") || "Auth Image";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads", "bg-images");
    await mkdir(uploadDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.split(".").pop();
    const filename = `${timestamp}.${originalName}`;
    const filepath = join(uploadDir, filename);

    // Save file
    await writeFile(filepath, buffer);

    // Save to database
    await connectToDatabase();

    const newImage = new BgImage({
      filename,
      path: `/uploads/bg-images/${filename}`,
      imageType,
      isActive: false,
    });

    await newImage.save();

    return NextResponse.json({
      success: true,
      message: "Image uploaded successfully",
      data: {
        filename,
        path: newImage.path,
        imageType,
      },
    });
  } catch (error) {
    console.error("Error uploading bg image:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image" },
      { status: 500 }
    );
  }
}
