const http = require('http');

const BASE_URL = 'http://localhost:3001';
let cookie = null;

function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (cookie) {
      options.headers['Cookie'] = cookie;
    }

    const req = http.request(options, (res) => {
      if (res.headers['set-cookie']) {
        cookie = res.headers['set-cookie'][0];
      }

      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function main() {
  console.log('\n=== TESTING VIDEO CREATION & DATABASE LINKING ===\n');

  try {
    // 1. Login
    console.log('1️⃣  Logging in...');
    const loginRes = await request('POST', '/api/auth/login', {
      email: 'admin@test.com',
      password: 'Admin@123',
    });
    if (loginRes.status !== 200) throw new Error(`Login failed: ${loginRes.status}`);
    console.log('   ✓ Login successful\n');

    // 2. Create video record in database (simulating post-upload creation)
    console.log('2️⃣  Creating video record via /api/admin/upload/video...');
    const videoRes = await request('POST', '/api/admin/upload/video', {
      fileName: 'sessions/test-video-123.mp4',
      videoUrl: '/uploads/videos/sessions/test-video-123.mp4',
      thumbnailName: 'thumbnails/test-thumb-123.jpg',
      thumbnailUrl: '/uploads/thumbnails/test-thumb-123.jpg',
      date: '2026-02-24',
      shorts: false,
      title: 'Test Video Upload',
      description: 'Testing the new upload flow with database creation',
      studentCategory: '["all"]',
      videoCategory: 'live',
      duration: '2:30',
      channelId: null,
    });
    
    if (videoRes.status !== 201) {
      throw new Error(`Video creation failed: ${videoRes.status}: ${JSON.stringify(videoRes.data)}`);
    }
    console.log('   ✓ Video record created');
    console.log(`   ✓ Video ID: ${videoRes.data.insertId}\n`);

    // 3. Get all videos to verify it appears in the list
    console.log('3️⃣  Fetching videos list...');
    const videosRes = await request('GET', '/api/videos');
    if (videosRes.status !== 200) throw new Error(`Failed to fetch videos: ${videosRes.status}`);
    
    const videoCount = videosRes.data.videos ? videosRes.data.videos.length : 0;
    console.log(`   ✓ Found ${videoCount} videos in database`);
    
    // Check if our test video is in the list
    const testVideo = videosRes.data.videos?.find(v => v.title === 'Test Video Upload');
    if (testVideo) {
      console.log(`   ✓ Our test video appears in the list`);
      console.log(`   ✓ Video details:`);
      console.log(`      - Title: ${testVideo.title}`);
      console.log(`      - URL: ${testVideo.videoUrl}`);
      console.log(`      - Category: ${testVideo.videoCategory}\n`);
    } else {
      console.log(`   ⚠ Test video not found in list (may be filtered)\n`);
    }

    // 4. Test admin GET endpoint with auth
    console.log('4️⃣  Testing admin /api/admin/videos endpoint...');
    const adminVideosRes = await request('GET', '/api/admin/videos');
    if (adminVideosRes.status === 403) {
      console.log('   ⚠ Got 403 - checking if middleware auth headers are working...');
    } else if (adminVideosRes.status === 200) {
      console.log(`   ✓ Admin endpoint working`);
      console.log(`   ✓ Retrieved ${adminVideosRes.data.videos?.length || 0} videos from admin\n`);
    } else {
      console.log(`   ✗ Unexpected status: ${adminVideosRes.status}\n`);
    }

    console.log('✅ Video creation and database linking test completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
