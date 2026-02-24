#!/usr/bin/env node
/**
 * Test script for local file storage upload flow
 * Tests all upload endpoints in sequence
 */

const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const API_BASE = 'http://localhost:3001/api/admin/upload';
const LOGIN_URL = 'http://localhost:3001/api/auth/login';

async function getAuthToken() {
  console.log('🔐 Authenticating...');
  const loginResponse = await fetch(LOGIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@test.com',
      password: 'Admin@123'
    })
  });

  if (!loginResponse.ok) {
    throw new Error(`Login failed: ${loginResponse.status}`);
  }

  const loginData = await loginResponse.json();
  const cookies = loginResponse.headers.get('set-cookie');

  if (loginData.data?.token) {
    return loginData.data.token;
  }

  if (cookies && cookies.includes('token=')) {
    const tokenMatch = cookies.match(/token=([^;]+)/);
    return tokenMatch ? tokenMatch[1] : null;
  }

  throw new Error('No token received from login');
}

async function testUploadFlow() {
  console.log('\n=== Testing Local File Storage Upload Flow ===\n');

  try {
    // Get authentication token
    const token = await getAuthToken();
    console.log(`✅ Authenticated\n`);

    // Test 1: Initiate upload
    console.log('1️⃣ Testing /initiate endpoint...');
    const initiateResponse = await fetch(`${API_BASE}/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      },
      body: JSON.stringify({
        fileName: 'test-video.mp4',
        fileType: 'video/mp4'
      })
    });

    if (!initiateResponse.ok) {
      throw new Error(`Initiate failed: ${initiateResponse.status}`);
    }

    const { UploadId } = await initiateResponse.json();
    console.log(`✅ Upload initiated with ID: ${UploadId}\n`);

    // Test 2: Upload chunks
    console.log('2️⃣ Testing /chunk endpoint...');

    // Create a test chunk (1MB of data)
    const chunkData = Buffer.alloc(1024 * 1024, 'test data');

    const chunkForm = new FormData();
    chunkForm.append('uploadId', UploadId);
    chunkForm.append('partNumber', 1);
    chunkForm.append('chunk', chunkData, 'chunk_1');

    const chunkResponse = await fetch(`${API_BASE}/chunk`, {
      method: 'POST',
      body: chunkForm,
      headers: {
        ...chunkForm.getHeaders(),
        'Cookie': `token=${token}`
      }
    });

    if (!chunkResponse.ok) {
      throw new Error(`Chunk upload failed: ${chunkResponse.status}`);
    }

    const chunkResult = await chunkResponse.json();
    console.log(`✅ Chunk 1 uploaded, ETag: ${chunkResult.ETag}\n`);

    // Test 3: Complete upload
    console.log('3️⃣ Testing /complete-video endpoint...');

    const completeResponse = await fetch(`${API_BASE}/complete-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      },
      body: JSON.stringify({
        fileName: 'test-video.mp4',
        uploadId: UploadId,
        parts: [
          {
            PartNumber: 1,
            ETag: chunkResult.ETag
          }
        ]
      })
    });

    if (!completeResponse.ok) {
      throw new Error(`Complete upload failed: ${completeResponse.status}`);
    }

    const { url, size } = await completeResponse.json();
    console.log(`✅ Upload completed!`);
    console.log(`   URL: ${url}`);
    console.log(`   Size: ${size} bytes\n`);

    // Test 4: Verify file exists
    console.log('4️⃣ Verifying file was created...');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'videos', 'test-video.mp4');
    if (fs.existsSync(uploadsDir)) {
      const stats = fs.statSync(uploadsDir);
      console.log(`✅ File exists at ${uploadsDir}`);
      console.log(`   Size: ${stats.size} bytes\n`);
    } else {
      throw new Error('File was not created on disk');
    }

    // Test 5: Test thumbnail upload
    console.log('5️⃣ Testing /thumbnail endpoint...');

    const thumbnailData = Buffer.from('fake image data');
    const thumbnailForm = new FormData();
    thumbnailForm.append('file', thumbnailData, { filename: 'test-thumbnail.jpg' });

    const thumbnailResponse = await fetch(`${API_BASE}/thumbnail`, {
      method: 'POST',
      body: thumbnailForm,
      headers: {
        ...thumbnailForm.getHeaders(),
        'Cookie': `token=${token}`
      }
    });

    if (!thumbnailResponse.ok) {
      throw new Error(`Thumbnail upload failed: ${thumbnailResponse.status}`);
    }

    const { uploadUrl: thumbUrl } = await thumbnailResponse.json();
    console.log(`✅ Thumbnail uploaded: ${thumbUrl}\n`);

    console.log('=== All Tests Passed! ✅ ===\n');
    process.exit(0);

  } catch (error) {
    console.error(`❌ Test failed: ${error.message}\n`);
    process.exit(1);
  }
}

testUploadFlow();
