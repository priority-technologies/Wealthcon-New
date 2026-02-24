export const maxDuration = 60;

import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request) {
  try {
    const { fileName, fileType } = await request.json();

    // Generate a unique upload ID
    const uploadId = uuidv4();

    // Create temp directory for this upload
    const uploadsDir = join(process.cwd(), "public", "uploads");
    const tempDir = join(uploadsDir, "temp", uploadId);

    await mkdir(tempDir, { recursive: true });

    return NextResponse.json({ UploadId: uploadId });
  } catch (error) {
    console.error("Error during upload initiation:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
