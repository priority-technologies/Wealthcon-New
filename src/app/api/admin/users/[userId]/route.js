import watchHistory from "@/schemas/WatchHistory";
import connectToDatabase from "../../../../../_database/mongodb";
import Users from "../../../../../schemas/Users";
import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { userId } = params;

    if (userId !== "new") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const { user } = await request.json();

    const {
      username,
      email,
      password,
      role,
      mobile,
      district,
      state,
      isActive,
    } = user;

    if (!username || !email || !password || !role || !mobile) {
      return NextResponse.json(
        { error: "Please fill all required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const isAlreadyExist = await Users.findOne({ email });
    if (isAlreadyExist) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const createUniqueUserId = async () => {
      const prefix = "TMP";
      let userId;
      try {
        const lastUser = await Users.findOne().sort({ createdAt: -1 }).exec();
        const lastId = lastUser ? lastUser.userId || "TMP0000" : "TMP0000";
        let lastIdNumber = parseInt(lastId.replace(prefix, ""), 10);

        while (true) {
          const nextIdNumber = lastIdNumber + 1;
          lastIdNumber = nextIdNumber;
          const paddedIdNumber = nextIdNumber.toString().padStart(4, "0");
          userId = `${prefix}${paddedIdNumber}`;

          const isAlreadyExist = await Users.findOne({ userId });
          if (!isAlreadyExist) {
            break;
          }
        }
      } catch (error) {
        console.error("Error generating user ID:", error);
        throw new Error("Could not create a unique user ID.");
      }
      return userId;
    };

    const uniqueUserId = await createUniqueUserId();

    const newUser = new Users({
      userId: uniqueUserId,
      // firstName,
      // lastName,
      username,
      email,
      password,
      role,
      mobile,
      district,
      state,
      isActive,
    });
    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully", userId: newUser._id },
      { status: 201 }
    );
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  const loggedUserId = request.headers.get("x-user-id");
  try {
    const query = params.userId;

    let userId;
    if (query == "new") {
      userId = loggedUserId;
    } else {
      userId = query;
    }

    await connectToDatabase();

    const user = await Users.findById(userId).select(
      "-createdAt -__v -lastLoginAt"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { userId } = params;
    const {
      username,
      email,
      district,
      state,
      profilePicture,
      mobile,
      password,
      role,
      isActive,
    } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is missing in the request parameters" },
        { status: 400 }
      );
    }

    // Establish a database connection
    await connectToDatabase();

    // Find the user by ID
    const user = await Users.findById(userId).select(
      "-password -createdAt -__v -lastLoginAt"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Handle password update
    if (password) {
      if (!password) {
        return NextResponse.json(
          { error: "Password not blank please add some value" },
          { status: 400 }
        );
      }
      // const salt = await bcrypt.genSalt(10);
      user.password = password;
    }

    // Handle profile picture update
    if (profilePicture) user.profilePicture = profilePicture;

    // Handle username update and uniqueness check
    if (username) user.username = username;

    // Handle email update and uniqueness check
    if (email && email !== user.email) {
      const existingEmail = await Users.findOne({
        _id: { $ne: user._id },
        email,
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: "Email already exists" },
          { status: 409 }
        );
      }
      user.email = email;
    }

    if (district) user.district = district;
    if (state) user.state = state;
    if (mobile) user.mobile = mobile;
    if (role) user.role = role;
    if (typeof isActive !== "undefined") user.isActive = isActive;

    await user.save();

    return NextResponse.json({
      message: "Updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const { userIds } = await request.json();

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { message: "No user IDs provided" },
        { status: 400 }
      );
    }

    const deletionResults = await Users.deleteMany({ _id: { $in: userIds } });

    if (deletionResults.deletedCount === 0) {
      return NextResponse.json(
        { message: "No users found to delete" },
        { status: 404 }
      );
    }

    await watchHistory.deleteMany({ userId: { $in: userIds } });

    return NextResponse.json({
      message: `${deletionResults.deletedCount} user(s) deleted successfully`,
    });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
