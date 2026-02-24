import { NextResponse } from "next/server";
import connectToDatabase from "@/_database/mongodb";
import Quotes from "@/schemas/Quotes"; // Your quote schema

export async function POST(request) {
  const { filename, url } = await request.json();

  if (!filename || !url) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  try {
    await connectToDatabase();
    const newQuote = new Quotes({
      image: url,
      imageFileName: filename,
    });
    const { _id } = await newQuote.save();

    return NextResponse.json({ message: "Upload complete", insertId: _id });
  } catch (error) {
    console.error("Error saving quote:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
