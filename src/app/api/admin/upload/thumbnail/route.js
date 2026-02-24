export const maxDuration = 60;

import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, dirname } from "path";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const fileName = formData.get("fileName");

    if (!file || !fileName) {
      return NextResponse.json(
        { error: "Missing required fields: file, fileName" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Create directory structure
    const uploadsDir = join(process.cwd(), "public", "uploads");
    const thumbnailsDir = join(uploadsDir, "thumbnails");

    await mkdir(thumbnailsDir, { recursive: true });

    // Save file
    const finalPath = join(thumbnailsDir, fileName);
    await writeFile(finalPath, fileBuffer);

    // Return file URL relative to public directory
    const url = `/uploads/thumbnails/${fileName}`;

    return NextResponse.json({
      url,
      fileName,
      size: fileBuffer.length,
    });
  } catch (error) {
    console.error("Error uploading thumbnail:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
