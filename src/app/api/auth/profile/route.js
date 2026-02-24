import connectToDatabase from "../../../../_database/mongodb";
import Users from "../../../../schemas/Users";
import { NextResponse } from "next/server";

export async function GET(request) {
  const loggedUserId = request.headers.get("x-user-id");
 
  try {
    await connectToDatabase();

    let user = await Users.findById(loggedUserId).select(
      "_id username email role"
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

export async function PUT(request) {
  try {
    const loggedUserId = request.headers.get("x-user-id");

    const {
      firstName,
      lastName,
      userName,
      email,
      profilePicture,
      phoneNumber,
      currentPassword,
      newPassword,
      confirmPassword,
    } = await request.json();

    if (!loggedUserId) {
      return NextResponse.json(
        { error: "User ID is missing in the request headers" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    if (!userName) {
      return NextResponse.json(
        { error: "userName is required" },
        { status: 400 }
      );
    }

    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return NextResponse.json(
          { error: "All password fields are required" },
          { status: 400 }
        );
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { error: "Passwords do not match" },
          { status: 400 }
        );
      }
    }

    await connectToDatabase();

    const user = await Users.findById(loggedUserId).select(
      "-password -createdAt -__v -lastLoginAt"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (email) {
      if (user.email !== email) {
        return NextResponse.json(
          { error: "Email not updated" },
          { status: 400 }
        );
      }
    }

    if (currentPassword && newPassword) {
      if (user.password !== currentPassword) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        );
      }
      user.password = newPassword;
    }

    if (profilePicture) {
    }

    if (userName) {
      const existingUserName = await Users.findOne({
        _id: { $ne: user._id },
        userName,
      });

      if (existingUserName) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 409 }
        );
      }
      user.userName = userName;
    }

    // if (email) {
    //   const existingEmail = await User.findOne({
    //     _id: { $ne: user._id },
    //     email,
    //   });

    //   if (existingEmail) {
    //     return NextResponse.json(
    //       { error: "Email already exists" },
    //       { status: 409 }
    //     );
    //   }
    //   user.email = email;
    // }

    // Update other fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    user.updatedAt = Date.now();
    await user.save();

    return NextResponse.json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
