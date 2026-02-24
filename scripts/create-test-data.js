const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/wealthcon', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schemas
const channelSchema = new mongoose.Schema({
  name: String,
  description: String,
  isActive: Boolean,
  creator: mongoose.Schema.Types.ObjectId,
  videoCount: { type: Number, default: 0 },
}, { timestamps: true });

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  videoFileName: String,
  thumbnailFileName: String,
  videoDuration: String,
  videoCategory: String,
  studentCategory: [String],
  viewCount: { type: Number, default: 0 },
  channelId: mongoose.Schema.Types.ObjectId,
  videoCreatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Channel = mongoose.model('Channel', channelSchema);
const Video = mongoose.model('Videos', videoSchema);

async function createTestData() {
  try {
    // Create test channel
    const channel = await Channel.create({
      name: 'Test Channel',
      description: 'A test channel for learning',
      isActive: true,
      videoCount: 4,
    });

    console.log('✓ Channel created');

    // Create test videos
    const videos = [
      {
        title: 'Getting Started with Node.js',
        description: 'Learn the basics of Node.js',
        videoFileName: 'test-video-1.mp4',
        thumbnailFileName: 'thumb-1.jpg',
        videoDuration: '15:30',
        videoCategory: 'recently-added',
        studentCategory: ['all', 'doctor'],
        viewCount: 150,
        channelId: channel._id,
      },
      {
        title: 'React Hooks Tutorial',
        description: 'Master React Hooks',
        videoFileName: 'test-video-2.mp4',
        thumbnailFileName: 'thumb-2.jpg',
        videoDuration: '22:45',
        videoCategory: 'recently-added',
        studentCategory: ['all', 'doctor'],
        viewCount: 200,
        channelId: channel._id,
      },
      {
        title: 'Live Coding Session - API Design',
        description: 'Real-time API design discussion',
        videoFileName: 'test-video-3.mp4',
        thumbnailFileName: 'thumb-3.jpg',
        videoDuration: '45:00',
        videoCategory: 'live',
        studentCategory: ['all', 'doctor'],
        viewCount: 300,
        channelId: channel._id,
      },
      {
        title: 'JavaScript Assignment - Todo App',
        description: 'Build a todo app with JavaScript',
        videoFileName: 'test-video-4.mp4',
        thumbnailFileName: 'thumb-4.jpg',
        videoDuration: '30:15',
        videoCategory: 'assignment',
        studentCategory: ['all', 'doctor'],
        viewCount: 180,
        channelId: channel._id,
      },
    ];

    await Video.insertMany(videos);
    console.log('✓ 4 test videos created');
    console.log('✅ Test data ready! Visit http://localhost:3001/home to see the content');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test data:', error.message);
    process.exit(1);
  }
}

createTestData();
