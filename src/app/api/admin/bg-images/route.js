export const dynamic = 'force-dynamic';

import connectToDatabase from "@/_database/mongodb";
import BgImage from "@/schemas/BgImage";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();

  try {
    const images = await BgImage.find().sort({ createdAt: -1 }).lean();
    const data = images.map((image) => ({
        ...image,
      path: `${process.env.AWS_CLOUDFRONT_URL}/${image.filename}`
    }));
    return NextResponse.json(data);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}
