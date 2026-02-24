import { NextResponse } from "next/server";
import BgImage from "@/schemas/BgImage";
import connectToDatabase from "@/_database/mongodb";
import { s3 } from "../../../../../helpers/constant";

export async function DELETE(request, { params: { imageId } }) {
    try {
        await connectToDatabase();

        const result = await BgImage.findByIdAndDelete(imageId);

        if (!result) {
            return NextResponse.json({ error: "Image not found" }, { status: 404 });
        }

        const galleryParams = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: result.filename,
        };
        await s3.deleteObject(galleryParams).promise();

        return NextResponse.json(
            { message: "Image deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error deleting bg image:", error);
        return NextResponse.json(
            { error: "Error deleting image", error: error.message },
            { status: 500 }
        );
    }
}

