const http = require('http');

const BASE_URL = 'http://localhost:3001';
let token = null;
let userId = null;

const tests = [];

function request(method, path, data = null, useToken = false) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (useToken && token) {
      options.headers['Cookie'] = `token=${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : null;
          resolve({ status: res.statusCode, data: json, headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function test(name, fn) {
  try {
    await fn();
    tests.push({ name, status: '✓ PASS' });
  } catch (error) {
    tests.push({ name, status: `✗ FAIL: ${error.message}` });
  }
}

async function main() {
  console.log('\n=== COMPREHENSIVE API AUDIT ===\n');

  // 1. LOGIN TEST
  await test('1. Login with valid credentials', async () => {
    const res = await request('POST', '/api/auth/login', {
      email: 'admin@test.com',
      password: 'Admin@123',
    });

    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
    }

    if (!res.data.message || !res.headers['set-cookie']) {
      throw new Error('No token in response');
    }

    token = res.headers['set-cookie'][0].split('token=')[1].split(';')[0];
  });

  // 2. GET PROFILE
  await test('2. Get user profile (authenticated)', async () => {
    const res = await request('GET', '/api/auth/profile', null, true);
    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
  });

  // 3. GET VIDEOS
  await test('3. Get videos list', async () => {
    const res = await request('GET', '/api/videos', null, true);
    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
  });

  // 4. GET SHORTS
  await test('4. Get shorts list', async () => {
    const res = await request('GET', '/api/shorts', null, true);
    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
  });

  // 5. GET NOTES
  await test('5. Get notes list', async () => {
    const res = await request('GET', '/api/notes', null, true);
    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
  });

  // 6. GET GALLERY
  await test('6. Get gallery list', async () => {
    const res = await request('GET', '/api/gallery', null, true);
    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
  });

  // 7. GET ANNOUNCEMENTS
  await test('7. Get announcements', async () => {
    const res = await request('GET', '/api/announcements', null, true);
    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
  });

  // 8. GET MESSAGES
  await test('8. Get messages', async () => {
    const res = await request('GET', '/api/messages', null, true);
    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
  });

  // 9. UPLOAD INITIATE
  await test('9. Upload initiate (create session)', async () => {
    const res = await request('POST', '/api/admin/upload/initiate', {}, true);
    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
    if (!res.data.UploadId) {
      throw new Error('No UploadId in response');
    }
  });

  // 10. SEARCH
  await test('10. Global search', async () => {
    const res = await request('GET', '/api/search?q=test', null, true);
    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}: ${JSON.stringify(res.data)}`);
    }
  });

  // Print results
  console.log('TEST RESULTS:\n');
  tests.forEach((t) => {
    console.log(`${t.status.padEnd(30)} - ${t.name}`);
  });

  const passed = tests.filter((t) => t.status.startsWith('✓')).length;
  const total = tests.length;
  console.log(`\n📊 Summary: ${passed}/${total} tests passed\n`);

  process.exit(passed === total ? 0 : 1);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
