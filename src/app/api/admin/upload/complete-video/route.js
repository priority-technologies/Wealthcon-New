export const maxDuration = 60;

import { NextResponse } from "next/server";
import { readFile, writeFile, unlink, readdir, rm, mkdir } from "fs/promises";
import { join, dirname } from "path";
import { existsSync } from "fs";

export async function POST(request) {
  try {
    const { fileName, uploadId, parts } = await request.json();

    if (!fileName || !uploadId || !parts.length) {
      return NextResponse.json(
        { error: "Missing required fields: fileName, uploadId, parts" },
        { status: 400 }
      );
    }

    const uploadsDir = join(process.cwd(), "public", "uploads");
    const tempDir = join(uploadsDir, "temp", uploadId);
    const videosDir = join(uploadsDir, "videos");
    const finalPath = join(videosDir, fileName);

    // Combine chunks in order
    const buffers = [];
    const sortedParts = parts.sort((a, b) => a.PartNumber - b.PartNumber);

    for (const part of sortedParts) {
      const chunkPath = join(tempDir, `part_${part.PartNumber}`);
      if (existsSync(chunkPath)) {
        const chunkData = await readFile(chunkPath);
        buffers.push(chunkData);
      }
    }

    // Combine all chunks into final file
    const finalBuffer = Buffer.concat(buffers);

    // Create directory structure if it doesn't exist
    await mkdir(dirname(finalPath), { recursive: true });

    await writeFile(finalPath, finalBuffer);

    // Clean up temp directory
    try {
      await rm(tempDir, { recursive: true, force: true });
    } catch (cleanupError) {
      console.warn("Could not delete temp directory:", cleanupError.message);
    }

    // Return file URL relative to public directory
    const fileUrl = `/uploads/videos/${fileName}`;

    return NextResponse.json({
      url: fileUrl,
      fileName,
      size: finalBuffer.length,
    });
  } catch (error) {
    console.error("Error completing upload:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
