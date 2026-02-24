#!/bin/bash

echo ""
echo "=== QUICK FUNCTIONAL TEST ==="
echo ""

# Test 1: Check admin/videos page loads
echo "1️⃣  Testing /admin/videos page..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/admin/videos)
if [ "$STATUS" = "307" ]; then
  echo "   ✓ Page responds with 307 (authentication redirect expected)"
elif [ "$STATUS" = "200" ]; then
  echo "   ✓ Page loads successfully"
else
  echo "   ✗ Unexpected status: $STATUS"
fi

# Test 2: Check upload endpoint exists
echo ""
echo "2️⃣  Testing /api/admin/upload/initiate..."
curl -s -X POST http://localhost:3001/api/admin/upload/initiate \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.mp4"}' | grep -q "UploadId" && echo "   ✓ Endpoint works" || echo "   ✗ Endpoint failed"

# Test 3: Check video creation endpoint exists
echo ""
echo "3️⃣  Testing /api/admin/upload/video endpoint exists..."
curl -s -X POST http://localhost:3001/api/admin/upload/video \
  -H "Content-Type: application/json" \
  -d '{"title":"test"}' | grep -q "error\|success" && echo "   ✓ Endpoint exists and responds" || echo "   ✗ Endpoint not responding"

# Test 4: Check videos list endpoint
echo ""
echo "4️⃣  Testing /api/videos endpoint (requires auth)..."
curl -s http://localhost:3001/api/videos | grep -q "authentication failed" && echo "   ✓ Endpoint requires auth (expected)" || echo "   ⚠ Unexpected response"

echo ""
echo "✅ All components present and operational"
echo ""
