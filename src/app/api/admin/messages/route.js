import connectToDatabase from "../../../../_database/mongodb";
import Messages from "../../../../schemas/Messages";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const loggedUserId = request.headers.get("x-user-id");
        const { message, studentCategory } = await request.json();

        if (!message || !studentCategory) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        await connectToDatabase();
        const newMessages = new Messages({
            message,
            studentCategory: JSON.parse(studentCategory),
            sender: loggedUserId ? loggedUserId : null,
        });
        const { _id } = await newMessages.save();
        return NextResponse.json({ message: "Send message", insertId: _id });
    } catch (error) {
        console.error("Error while registering user:", error.message);
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}