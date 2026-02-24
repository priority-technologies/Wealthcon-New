import mongoose from "mongoose";
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/wealthcon";

async function seedDemoData() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    const db = client.db("wealthcon");
    console.log("✅ Connected to MongoDB");

    // Find or create admin user
    const usersCollection = db.collection("users");
    let adminUser = await usersCollection.findOne({ email: "admin@wealthcon.com" });

    if (!adminUser) {
      const result = await usersCollection.insertOne({
        userId: "ADMIN001",
        username: "admin",
        email: "admin@wealthcon.com",
        password: "$2b$10$K8cT8.2K1V1K1V1K1V1K1V", // hashed password
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
      adminUser = { _id: result.insertedId };
      console.log("✅ Created admin user");
    } else {
      adminUser = { _id: adminUser._id };
      console.log("✅ Admin user already exists");
    }

    // Create/Find Dr. Ram's Channel
    const channelsCollection = db.collection("channels");
    let channel = await channelsCollection.findOne({ name: "Dr. Ram's Channel" });

    if (!channel) {
      const result = await channelsCollection.insertOne({
        name: "Dr. Ram's Channel",
        description: "A channel dedicated to Dr. Ram's educational content",
        educatorName: "Dr. Ram",
        profilePicture: "https://via.placeholder.com/150",
        creator: adminUser._id,
        videoCount: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      channel = { _id: result.insertedId };
      console.log("✅ Created Dr. Ram's Channel");
    } else {
      channel = { _id: channel._id };
      console.log("✅ Dr. Ram's Channel already exists");
    }

    // Add 3-4 regular videos
    const videosCollection = db.collection("videos");
    const videosData = [
      {
        title: "Introduction to Physics",
        description: "Basic concepts of physics for beginners",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnail: "https://via.placeholder.com/320x180?text=Physics+101",
        videoFileName: "physics_intro.mp4",
        thumbnailFileName: "physics_intro_thumb.jpg",
        videoDuration: 600,
        shorts: false,
        orientation: "landscape",
        studentCategory: ["admin", "lot1", "lot2"],
        videoCategory: "live",
        channelId: channel._id,
        viewCount: 0,
        isDownloadable: false,
        videoCreatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Advanced Mathematics Concepts",
        description: "Deep dive into advanced mathematical theory",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        thumbnail: "https://via.placeholder.com/320x180?text=Math+Advanced",
        videoFileName: "math_advanced.mp4",
        thumbnailFileName: "math_advanced_thumb.jpg",
        videoDuration: 720,
        shorts: false,
        orientation: "landscape",
        studentCategory: ["admin", "lot2", "lot3"],
        videoCategory: "live",
        channelId: channel._id,
        viewCount: 5,
        isDownloadable: false,
        videoCreatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Chemistry Lab Experiment",
        description: "Practical chemistry experiments explained",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnail: "https://via.placeholder.com/320x180?text=Chemistry+Lab",
        videoFileName: "chemistry_lab.mp4",
        thumbnailFileName: "chemistry_lab_thumb.jpg",
        videoDuration: 540,
        shorts: false,
        orientation: "landscape",
        studentCategory: ["admin", "lot3", "lot4"],
        videoCategory: "live",
        channelId: channel._id,
        viewCount: 3,
        isDownloadable: false,
        videoCreatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Biology: Cell Structure and Function",
        description: "Understanding cellular biology in detail",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        thumbnail: "https://via.placeholder.com/320x180?text=Biology+Cells",
        videoFileName: "biology_cells.mp4",
        thumbnailFileName: "biology_cells_thumb.jpg",
        videoDuration: 480,
        shorts: false,
        orientation: "landscape",
        studentCategory: ["admin", "lot1", "lot4"],
        videoCategory: "live",
        channelId: channel._id,
        viewCount: 2,
        isDownloadable: false,
        videoCreatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const videoData of videosData) {
      const existingVideo = await videosCollection.findOne({ title: videoData.title });
      if (!existingVideo) {
        await videosCollection.insertOne(videoData);
        console.log(`✅ Added video: ${videoData.title}`);
      } else {
        console.log(`⏭️  Video already exists: ${videoData.title}`);
      }
    }

    // Add shorts (vertical videos)
    const shortsData = [
      {
        title: "Quick Physics Tip",
        description: "A quick tip about Newton's laws",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        thumbnail: "https://via.placeholder.com/180x320?text=Tip+1",
        videoFileName: "short_physics_tip.mp4",
        thumbnailFileName: "short_physics_tip_thumb.jpg",
        videoDuration: 30,
        shorts: true,
        orientation: "portrait",
        studentCategory: ["admin", "lot1"],
        videoCategory: "live",
        channelId: channel._id,
        viewCount: 10,
        isDownloadable: false,
        videoCreatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Math Problem Solution",
        description: "Solving a complex math problem in 45 seconds",
        videoUrl: "https://www.w3schools.com/html/movie.mp4",
        thumbnail: "https://via.placeholder.com/180x320?text=Math+Short",
        videoFileName: "short_math_solution.mp4",
        thumbnailFileName: "short_math_solution_thumb.jpg",
        videoDuration: 45,
        shorts: true,
        orientation: "portrait",
        studentCategory: ["admin", "lot2"],
        videoCategory: "live",
        channelId: channel._id,
        viewCount: 8,
        isDownloadable: false,
        videoCreatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const shortData of shortsData) {
      const existingShort = await videosCollection.findOne({ title: shortData.title });
      if (!existingShort) {
        await videosCollection.insertOne(shortData);
        console.log(`✅ Added short: ${shortData.title}`);
      } else {
        console.log(`⏭️  Short already exists: ${shortData.title}`);
      }
    }

    // Add gallery images for charts
    const galleryCollection = db.collection("gallaries");
    const galleryData = [
      {
        title: "Performance Chart - Q1 2024",
        description: "Student performance metrics for Q1 2024",
        image: "https://via.placeholder.com/600x400?text=Performance+Chart+Q1",
        imageFileName: "performance_q1_2024.png",
        studentCategory: ["admin", "lot1", "lot2"],
        viewCount: 15,
        isDownloadable: false,
        imageCreatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Progress Overview - Mathematics",
        description: "Overall progress in mathematics across all batches",
        image: "https://via.placeholder.com/600x400?text=Math+Progress",
        imageFileName: "math_progress_overview.png",
        studentCategory: ["admin", "lot2"],
        viewCount: 12,
        isDownloadable: false,
        imageCreatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Attendance Report - February",
        description: "Monthly attendance report for February 2024",
        image: "https://via.placeholder.com/600x400?text=Attendance+Report",
        imageFileName: "attendance_feb_2024.png",
        studentCategory: ["admin"],
        viewCount: 8,
        isDownloadable: false,
        imageCreatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Subject Wise Performance",
        description: "Comparative performance analysis across subjects",
        image: "https://via.placeholder.com/600x400?text=Subject+Performance",
        imageFileName: "subject_wise_performance.png",
        studentCategory: ["admin", "lot1", "lot2", "lot3"],
        viewCount: 20,
        isDownloadable: false,
        imageCreatedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (const galleryItem of galleryData) {
      const existingGallery = await galleryCollection.findOne({ title: galleryItem.title });
      if (!existingGallery) {
        await galleryCollection.insertOne(galleryItem);
        console.log(`✅ Added gallery image: ${galleryItem.title}`);
      } else {
        console.log(`⏭️  Gallery image already exists: ${galleryItem.title}`);
      }
    }

    console.log("\n✨ Demo data seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding demo data:", error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedDemoData();
