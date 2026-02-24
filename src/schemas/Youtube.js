import mongoose from "mongoose";

const YoutubeSchema = new mongoose.Schema({
  yturl: { type: String, required: true },
  date: { type: Date, required: true },
  title: { type: String, required: true },
  shorts: { type: Boolean, default: false },
  description: { type: String, required: true },
  studentCategory: [{ type: String, required: true }],
  videoCategory: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


const YoutubeVideos = mongoose.models.YoutubeVideos || mongoose.model("YoutubeVideos", YoutubeSchema);

export default YoutubeVideos;