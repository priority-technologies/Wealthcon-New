export const maxDuration = 60;

import { NextResponse } from "next/server";
import connectToDatabase from "../../../../../_database/mongodb";
import Gallary from "../../../../../schemas/Gallary";

export async function POST(request) {
  try {
    const {
      filename,
      url,
      date,
      title,
      description,
      studentCategory,
    } = await request.json();

    if (
      !filename ||
      !url ||
      !date ||
      !title ||
      !description ||
      !studentCategory
    ) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const parsedDate = new Date(date);
    const currentTime = new Date();
    parsedDate.setHours(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());

    await connectToDatabase();

    const newGallry = new Gallary({
      title,
      description,
      image: url,
      imageFileName: filename,
      studentCategory: JSON.parse(studentCategory),
      imageCreatedAt: parsedDate
    });
    await newGallry.save();

    return NextResponse.json({ message: "Upload complete" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
