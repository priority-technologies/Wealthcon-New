import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/wealthcon";

async function createTestUsers() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db("wealthcon");
    const usersCollection = db.collection("users");

    console.log("Creating test users...\n");

    // Hash passwords
    const adminPassword = await bcrypt.hash("Admin@123", 10);
    const userPassword = await bcrypt.hash("User@123", 10);

    // Admin user
    const adminExist = await usersCollection.findOne({ email: "admin@test.com" });
    if (!adminExist) {
      await usersCollection.insertOne({
        userId: "ADMIN002",
        username: "Admin User",
        email: "admin@test.com",
        password: adminPassword,
        role: "admin",
        mobile: 9999999999,
        isActive: true,
        savedLater: [],
        viewVideos: [],
        viewNotes: [],
        viewGallaries: [],
        viewMessages: [],
        viewAnnouncements: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("✅ Admin user created");
      console.log("   Email: admin@test.com");
      console.log("   Password: Admin@123");
    } else {
      console.log("⏭️  Admin user already exists");
    }

    // Regular user (lot1)
    const userExist = await usersCollection.findOne({ email: "user@test.com" });
    if (!userExist) {
      await usersCollection.insertOne({
        userId: "USR00001",
        username: "Test User",
        email: "user@test.com",
        password: userPassword,
        role: "lot1",
        mobile: 9999999998,
        isActive: true,
        savedLater: [],
        viewVideos: [],
        viewNotes: [],
        viewGallaries: [],
        viewMessages: [],
        viewAnnouncements: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("\n✅ Regular user created");
      console.log("   Email: user@test.com");
      console.log("   Password: User@123");
    } else {
      console.log("⏭️  Regular user already exists");
    }

    console.log("\n✨ Test users ready!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating test users:", error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

createTestUsers();
