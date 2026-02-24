export const maxDuration = 60;

import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../_database/mongodb";
import BgImage from "@/schemas/BgImage";

export async function POST(request) {
  try {
    const { filename, url } = await request.json();

    if (!filename || !url) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await connectToDatabase();

    const newImage = new BgImage({
      filename,
      path: url,
    });

    await newImage.save();

    return NextResponse.json({
      message: "Image uploaded",
      path: newImage.path,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
