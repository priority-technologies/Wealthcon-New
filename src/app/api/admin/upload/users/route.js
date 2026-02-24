import connectToDatabase from "../../../../../_database/mongodb";
import Users from "../../../../../schemas/Users";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { users } = await request.json();

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: "No users data provided" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Function to get the last userId
    const getLastUserId = async () => {
      const lastUser = await Users.findOne().sort({ createdAt: -1 }).exec();
      const lastId = lastUser ? lastUser.userId || "TMP0000" : "TMP0000";
      const prefix = "TMP";
      const lastIdNumber = parseInt(lastId.replace(prefix, ""), 10);
      return lastIdNumber;
    };

    let lastUserId = await getLastUserId();

    for (const user of users) {
      const {
        username,
        email,
        password,
        phoneNumber,
        role,
        mobile,
        district,
        state,
        isActive,
      } = user;

      if (!username || !email || !password) {
        continue;
      }

      const existingUser = await Users.findOne({ email });

      // Increment userId for new user
      
      let userId;
      
      while (true) {
        const nextIdNumber = lastUserId + 1;
        lastUserId = nextIdNumber;
        
        const nextIdString = nextIdNumber.toString();
        const paddingLength = Math.max(4, nextIdString.length);
        const paddedIdNumber = nextIdNumber.toString().padStart(paddingLength, "0");
        userId = `TMP${paddedIdNumber}`;
    
        const exists = await Users.findOne({ userId });
        if (!exists) {
          break;
        }
      }

      if (existingUser) {
        // Update existing user
        existingUser.username = username;
        existingUser.role = role;
        existingUser.mobile = mobile;
        existingUser.district = district;
        existingUser.state = state;
        existingUser.isActive = isActive !== undefined ? isActive : existingUser.isActive;
        existingUser.updatedAt = new Date();

        await existingUser.save();
      } else {
        // Create new user
        const newUser = new Users({
          userId,
          username,
          email,
          phoneNumber,
          password,
          role,
          mobile,
          district,
          state,
          isActive: isActive !== undefined ? isActive : true,
          savedLater: [],
          updatedAt: new Date(),
        });
        await newUser.save();
      }
    }

    return NextResponse.json(
      { message: "Users processed successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing users:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
