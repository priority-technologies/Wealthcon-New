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
    console.log(`   ✓ Login successful\n`);

    // 2. Initiate upload
    console.log('2️⃣  Initiating upload...');
    const initiateRes = await request('POST', '/api/admin/upload/initiate', {});
    if (initiateRes.status !== 200) throw new Error(`Initiate failed: ${initiateRes.status}`);
    const uploadId = initiateRes.data.UploadId;
    console.log(`   ✓ Upload ID: ${uploadId}\n`);

    // 3. Upload chunks and collect part info
    console.log('3️⃣  Uploading chunks...');
    const parts = [];
    const chunkSize = 1024 * 50; // 50KB chunks
    const fileSize = 1024 * 150; // 150KB total
    
    for (let i = 1; i * chunkSize < fileSize; i++) {
      const testData = Buffer.alloc(chunkSize);
      testData.fill('test data');

      const form = new FormData();
      form.append('uploadId', uploadId);
      form.append('partNumber', i.toString());
      form.append('chunk', testData, `chunk-${i}.bin`);

      const chunkRes = await request('POST', '/api/admin/upload/chunk', null, true, form);
      if (chunkRes.status !== 200) throw new Error(`Chunk ${i} failed: ${chunkRes.status}`);
      
      parts.push({
        PartNumber: chunkRes.data.PartNumber,
        ETag: chunkRes.data.ETag,
      });
      console.log(`   ✓ Chunk ${i} uploaded (ETag: ${chunkRes.data.ETag.substring(0, 8)}...)`);
    }
    console.log();

    // 4. Complete upload with parts array
    console.log('4️⃣  Completing upload...');
    const completeRes = await request('POST', '/api/admin/upload/complete-video', {
      uploadId: uploadId,
      fileName: 'test-video.mp4',
      parts: parts,
    });
    if (completeRes.status !== 200) throw new Error(`Complete failed: ${completeRes.status}: ${JSON.stringify(completeRes.data)}`);
    console.log(`   ✓ Upload completed\n   ✓ File URL: ${completeRes.data.url}\n`);

    // 5. Verify file exists
    console.log('5️⃣  Verifying file...');
    const videoPath = 'public/uploads/videos/test-video.mp4';
    if (fs.existsSync(videoPath)) {
      const stats = fs.statSync(videoPath);
      console.log(`   ✓ File exists: ${videoPath}`);
      console.log(`   ✓ File size: ${(stats.size / 1024).toFixed(2)} KB\n`);
    } else {
      throw new Error(`File not found: ${videoPath}`);
    }

    console.log('✅ Upload flow completed successfully');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();
