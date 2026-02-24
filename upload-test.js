const http = require('http');
const fs = require('fs');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:3001';
let token = null;
let uploadId = null;

function requestJSON(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': token ? `token=${token}` : '',
      },
    };

    const req = http.request(options, (res) => {
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

function requestMultipart(method, path, formData) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        ...formData.getHeaders(),
        'Cookie': token ? `token=${token}` : '',
      },
    };

    const req = http.request(options, (res) => {
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
    formData.pipe(req);
  });
}

async function main() {
  console.log('\n=== UPLOAD FLOW AUDIT ===\n');

  try {
    // 1. Login
    console.log('1️⃣  Logging in...');
    const loginRes = await requestJSON('POST', '/api/auth/login', {
      email: 'admin@test.com',
      password: 'Admin@123',
    });
    if (loginRes.status !== 200) throw new Error(`Login failed: ${loginRes.status}`);
    token = loginRes.data.token || 'admin@test.com';
    console.log('   ✓ Login successful\n');

    // 2. Initiate upload
    console.log('2️⃣  Initiating upload...');
    const initiateRes = await requestJSON('POST', '/api/admin/upload/initiate', {});
    if (initiateRes.status !== 200) throw new Error(`Initiate failed: ${initiateRes.status}`);
    uploadId = initiateRes.data.UploadId;
    console.log(`   ✓ Upload ID: ${uploadId}\n`);

    // 3. Create test file and upload chunk
    console.log('3️⃣  Uploading chunk...');
    const testData = Buffer.alloc(1024 * 100); // 100KB test file
    testData.fill('test data');

    const form = new FormData();
    form.append('uploadId', uploadId);
    form.append('partNumber', '1');
    form.append('chunk', testData, 'test-video.mp4');

    const chunkRes = await requestMultipart('POST', '/api/admin/upload/chunk', form);
    if (chunkRes.status !== 200) throw new Error(`Chunk upload failed: ${chunkRes.status}`);
    console.log('   ✓ Chunk uploaded\n');

    // 4. Complete upload
    console.log('4️⃣  Completing upload...');
    const completeRes = await requestJSON('POST', '/api/admin/upload/complete-video', {
      uploadId: uploadId,
      fileName: 'test-video.mp4',
      originalName: 'test-video.mp4',
    });
    if (completeRes.status !== 200) throw new Error(`Complete failed: ${completeRes.status}`);
    console.log(`   ✓ Upload completed\n`);

    // 5. Check if file exists
    console.log('5️⃣  Checking file system...');
    const uploadPath = `public/uploads/videos/test-video.mp4`;
    const fileExists = fs.existsSync(uploadPath);
    console.log(`   ${fileExists ? '✓' : '❌'} File exists: ${uploadPath}\n`);

    // 6. Get videos to see if new video appears
    console.log('6️⃣  Checking video list...');
    const videosRes = await requestJSON('GET', '/api/videos');
    if (videosRes.status === 200) {
      console.log(`   ✓ Video list accessible (${videosRes.data.data ? videosRes.data.data.length : 0} videos)\n`);
    }

    console.log('✅ Upload flow test completed');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
