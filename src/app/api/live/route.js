import connectToDatabase from "@/_database/mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Connect to the database
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit")) || 100;
    const skip = parseInt(searchParams.get("skip")) || 0;

    const collections = await db.listCollections().toArray();
    const databaseExport = {};

    for (const collection of collections) {
      const collectionName = collection.name;
      const documents = await db
        .collection(collectionName)
        .find({})
        .skip(skip)
        .limit(limit)
        .toArray();
      databaseExport[collectionName] = documents;
    }

    const jsonContent = JSON.stringify(databaseExport, null, 2);

    return new NextResponse(jsonContent, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename=database-export-${skip}-${skip + limit}.json`,
      },
    });
  } catch (error) {
    console.error("Error exporting database:", error.message);
    return NextResponse.json(
      { error: "Failed to export database. Please try again later." },
      { status: 500 }
    );
  }
}
