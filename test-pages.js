const http = require('http');

const BASE_URL = 'http://localhost:3001';
let cookie = null;

function request(method, path) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method: method,
      headers: {},
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
        const isHTML = res.headers['content-type']?.includes('text/html');
        const hasContent = body && body.length > 100;
        const status = res.statusCode;
        
        resolve({
          status,
          isHTML,
          hasContent,
          contentLength: body.length,
        });
      });
    });

    req.on('error', (err) => {
      resolve({ status: 0, isHTML: false, hasContent: false, error: err.message });
    });

    req.end();
  });
}

async function main() {
  console.log('\n=== TESTING USER-FACING PAGES ===\n');

  // First login to get authenticated
  const loginUrl = new URL(BASE_URL + '/api/auth/login');
  const loginReq = http.request({
    hostname: loginUrl.hostname,
    port: loginUrl.port,
    path: loginUrl.pathname,
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, (res) => {
    if (res.headers['set-cookie']) {
      cookie = res.headers['set-cookie'][0];
    }
  });

  loginReq.write(JSON.stringify({
    email: 'admin@test.com',
    password: 'Admin@123',
  }));
  loginReq.end();

  await new Promise(resolve => setTimeout(resolve, 1000));

  const userPages = [
    '/home',
    '/videos',
    '/shorts',
    '/notes',
    '/gallery',
    '/charts',
    '/message',
    '/announcement',
    '/watch_later',
    '/my-list',
    '/profile',
    '/change-password',
    '/dr-ram',
    '/admin-update',
    '/live_session',
    '/yt_session',
    '/login',
    '/forgot-password',
  ];

  const adminPages = [
    '/admin',
    '/admin/videos',
    '/admin/shorts',
    '/admin/notes',
    '/admin/gallery',
    '/admin/message',
    '/admin/announcement',
    '/admin/quote',
    '/admin/channels',
    '/admin/users',
    '/admin/bg-images',
    '/admin/live_session',
    '/admin/yt_session',
  ];

  console.log('USER-FACING PAGES:');
  console.log('─'.repeat(60));
  
  for (const page of userPages) {
    const res = await request('GET', page);
    const status = res.status === 200 ? '✓ 200 OK' : res.status === 0 ? '✗ ERROR' : `⚠ ${res.status}`;
    const hasContent = res.hasContent ? '(has content)' : '(no content)';
    console.log(`${status.padEnd(20)} ${page.padEnd(25)} ${hasContent}`);
  }

  console.log('\n\nADMIN PAGES:');
  console.log('─'.repeat(60));
  
  for (const page of adminPages) {
    const res = await request('GET', page);
    const status = res.status === 200 ? '✓ 200 OK' : res.status === 0 ? '✗ ERROR' : `⚠ ${res.status}`;
    const hasContent = res.hasContent ? '(has content)' : '(no content)';
    console.log(`${status.padEnd(20)} ${page.padEnd(25)} ${hasContent}`);
  }

  console.log('\n');
}

main().catch(console.error);
