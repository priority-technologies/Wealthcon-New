import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("file");
    const fileType = form.get("fileType");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Use original filename or generate one
    const fileName = file.name || `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Save file based on type
    const uploadsDir = join(process.cwd(), "public", "uploads");
    const subDir = fileType?.startsWith("video") ? "videos" : "files";
    const filePath = join(uploadsDir, subDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // Return file URL
    const fileUrl = `/uploads/${subDir}/${fileName}`;

    return NextResponse.json({
      uploadUrl: fileUrl,
      fileName,
      size: buffer.length,
    });
  } catch (error) {
    console.error("Error during file upload:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
