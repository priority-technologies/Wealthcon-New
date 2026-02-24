const http = require('http');
const fs = require('fs');
const FormData = require('form-data');

const BASE_URL = 'http://localhost:3001';
let cookie = null;

function request(method, path, data = null, isMultipart = false, form = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': isMultipart ? 'multipart/form-data' : 'application/json',
      },
    };

    if (cookie) {
      options.headers['Cookie'] = cookie;
    }

    if (isMultipart && form) {
      Object.assign(options.headers, form.getHeaders());
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
          resolve({ status: res.statusCode, data: json, headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on('error', reject);

    if (isMultipart && form) {
      form.pipe(req);
    } else if (data) {
      req.write(JSON.stringify(data));
      req.end();
    } else {
      req.end();
    }
  });
}

async function main() {
  console.log('\n=== UPLOAD FLOW AUDIT ===\n');

  try {
    // 1. Login
    console.log('1️⃣  Logging in...');
    const loginRes = await request('POST', '/api/auth/login', {
      email: 'admin@test.com',
      password: 'Admin@123',
    });
    if (loginRes.status !== 200) throw new Error(`Login failed: ${loginRes.status}`);
    console.log(`   ✓ Login successful, cookie: ${cookie.substring(0, 30)}...\n`);

    // 2. Initiate upload
    console.log('2️⃣  Initiating upload...');
    const initiateRes = await request('POST', '/api/admin/upload/initiate', {});
    if (initiateRes.status !== 200) throw new Error(`Initiate failed: ${initiateRes.status}: ${JSON.stringify(initiateRes.data)}`);
    const uploadId = initiateRes.data.UploadId;
    console.log(`   ✓ Upload ID: ${uploadId}\n`);

    // 3. Upload chunk
    console.log('3️⃣  Uploading chunk...');
    const testData = Buffer.alloc(1024 * 100);
    testData.fill('test data');

    const form = new FormData();
    form.append('uploadId', uploadId);
    form.append('partNumber', '1');
    form.append('chunk', testData, 'test-chunk.bin');

    const chunkRes = await request('POST', '/api/admin/upload/chunk', null, true, form);
    if (chunkRes.status !== 200) throw new Error(`Chunk upload failed: ${chunkRes.status}`);
    console.log('   ✓ Chunk uploaded\n');

    // 4. Complete upload
    console.log('4️⃣  Completing upload...');
    const completeRes = await request('POST', '/api/admin/upload/complete-video', {
      uploadId: uploadId,
      fileName: 'test-video.mp4',
    });
    if (completeRes.status !== 200) throw new Error(`Complete failed: ${completeRes.status}: ${JSON.stringify(completeRes.data)}`);
    console.log(`   ✓ File saved to: ${completeRes.data.filePath || 'N/A'}\n`);

    // 5. Check file exists
    console.log('5️⃣  Verifying file...');
    const videoDir = 'public/uploads/videos';
    if (fs.existsSync(videoDir)) {
      const files = fs.readdirSync(videoDir);
      console.log(`   ✓ Files in uploads: ${files.join(', ')}\n`);
    } else {
      console.log('   ❌ Upload directory not found\n');
    }

    console.log('✅ Upload flow completed successfully');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
