export const maxDuration = 60;

import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { createHash } from "crypto";

export async function POST(request) {
  try {
    const form = await request.formData();
    const uploadId = form.get("uploadId");
    const partNumber = parseInt(form.get("partNumber"), 10);
    const chunk = form.get("chunk");

    if (!uploadId || !partNumber || !chunk) {
      return NextResponse.json(
        { error: "Missing required fields: uploadId, partNumber, chunk" },
        { status: 400 }
      );
    }

    // Convert chunk to buffer
    const chunkBuffer = Buffer.from(await chunk.arrayBuffer());

    // Save chunk to temp directory
    const uploadsDir = join(process.cwd(), "public", "uploads");
    const tempDir = join(uploadsDir, "temp", uploadId);
    const chunkPath = join(tempDir, `part_${partNumber}`);

    await writeFile(chunkPath, chunkBuffer);

    // Generate ETag (MD5 hash of chunk for S3 compatibility)
    const etag = createHash("md5").update(chunkBuffer).digest("hex");

    return NextResponse.json({
      ETag: etag,
      PartNumber: partNumber,
      chunkPath,
    });
  } catch (error) {
    console.error("Error uploading chunk:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
