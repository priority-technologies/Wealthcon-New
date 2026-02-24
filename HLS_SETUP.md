# HLS Video Streaming Setup Guide

## Overview

This project now includes full HLS (HTTP Live Streaming) support with adaptive bitrate streaming using Shaka Packager and Shaka Player.

## What's Installed

- ✅ **Shaka Player** (v4.11.0) - JavaScript library for HLS playback
- ✅ **Shaka Packager** (npm package) - CLI tool for video conversion
- ✅ **HLSVideoPlayer Component** - React component with auto-detection
- ✅ **HLS Converter API** - Backend endpoint for video conversion
- ✅ **Admin HLS Panel** - UI for managing conversions

## How It Works

### Video Flow

1. **Upload Phase**
   - User uploads MP4 video via `/admin/videos`
   - File saved to `/public/uploads/videos/{sessionId}.mp4`
   - Video metadata saved to database

2. **Conversion Phase** (Optional but Recommended)
   - Admin navigates to `/admin/hls-converter`
   - Enters video filename: `sessions/1234.mp4`
   - Clicks "Start HLS Conversion"
   - Shaka Packager converts to HLS format:
     - Creates directory: `/public/uploads/videos/sessionid/`
     - Generates master playlist: `sessionid.m3u8`
     - Creates 2-second chunks: `segment_00001.ts`, `segment_00002.ts`, etc.

3. **Playback Phase**
   - User opens video on `/videos/{videoId}`
   - HLSVideoPlayer component checks for HLS version
   - If HLS available: uses adaptive bitrate streaming
   - If not: falls back to MP4 format
   - Shaka Player auto-selects quality based on bandwidth

### Adaptive Bitrate Streaming

Shaka Player automatically adjusts video quality based on:
- Available network bandwidth
- Current buffer health
- User's device capabilities
- Configured bandwidth restrictions

## Installation & Setup

### Step 1: Verify Installation

Check that packages are installed:
```bash
npm list shaka-player shaka-packager
```

Expected output:
```
├── shaka-packager@1.0.0
└── shaka-player@4.11.0
```

### Step 2: Verify Shaka Packager CLI

Shaka Packager may need to be installed separately on your system:

**On macOS:**
```bash
brew install shaka-packager
```

**On Windows (with Chocolatey):**
```bash
choco install shaka-packager
```

**On Linux (Ubuntu/Debian):**
```bash
# Build from source or use prebuilt binaries
git clone https://github.com/google/shaka-packager.git
cd shaka-packager
./configure
make
sudo make install
```

**Verify installation:**
```bash
shaka-packager --version
```

### Step 3: Test HLS Conversion

1. Upload a test video through Admin Videos
2. Navigate to `http://localhost:3001/admin/hls-converter`
3. Enter filename: `your_uploaded_file.mp4`
4. Click "Start HLS Conversion"
5. Wait for completion (5-15 minutes depending on video length)

## API Endpoints

### POST `/api/admin/upload/convert-hls`

Starts HLS conversion for an uploaded video.

**Request:**
```json
{
  "videoFileName": "sessions/1234.mp4"
}
```

**Response:**
```json
{
  "success": true,
  "message": "HLS conversion started",
  "videoFileName": "sessions/1234.mp4",
  "hlsDirectory": "/public/uploads/videos/sessions/1234/",
  "estimatedTime": "5-15 minutes depending on video length",
  "note": "Conversion is happening in the background. Check back later for completion."
}
```

### GET `/api/admin/upload/convert-hls`

Check conversion status.

**Request:**
```
GET /api/admin/upload/convert-hls?videoFileName=sessions/1234.mp4
```

**Response:**
```json
{
  "videoFileName": "sessions/1234.mp4",
  "isConverted": true,
  "hlsUrl": "/uploads/videos/sessions/1234/1234.m3u8",
  "status": "completed"
}
```

## Video Player Features

### HLSVideoPlayer Component

Location: `src/components/UserContent/HLSVideoPlayer.jsx`

**Features:**
- Automatic HLS detection
- Adaptive bitrate streaming
- MP4 fallback support
- Resume from saved position
- Time tracking for watch history
- Error handling and recovery
- Buffer status indicators
- Stream type badge (shows "🎬 HLS" or "📹 MP4")

**Usage:**
```jsx
<HLSVideoPlayer
  videoUrl="/uploads/videos/sessions/1234.mp4"
  resumeTime={180} // Resume at 3 minutes
  onTimeUpdate={(currentTime) => console.log(currentTime)}
  onPlayPause={(isPlaying) => console.log(isPlaying)}
  className="mb-6"
/>
```

## Directory Structure

After conversion, the structure looks like:

```
/public/uploads/videos/
├── 1234.mp4                    # Original MP4 (can be deleted after HLS)
└── 1234/                       # HLS directory
    ├── 1234.m3u8             # Master playlist (HTTP Live Streaming)
    ├── segment_00001.ts      # Video segment 1 (0-2 seconds)
    ├── segment_00002.ts      # Video segment 2 (2-4 seconds)
    ├── segment_00003.ts      # Video segment 3 (4-6 seconds)
    └── segment_NNNNN.ts      # ... continues for entire video
```

The `.m3u8` file is a text playlist that lists all segments and is read by the player.
The `.ts` files are MPEG transport stream video segments (typically 2 seconds each).

## Configuration

### Shaka Player Configuration

Edit buffer and streaming settings in `HLSVideoPlayer.jsx`:

```javascript
const config = {
  streaming: {
    bufferingGoal: 8,        // 8 second buffer goal
    rebufferingGoal: 4,      // 4 second rebuffering goal
    bufferBehind: 30,        // Keep 30 seconds behind
    jumpLargeGaps: true,
    smallGapLimit: 0.5,
    preferredAudioLanguage: 'en',
  },
};
```

### Shaka Packager Configuration

Edit conversion settings in `src/utils/hlsConverter.js`:

```javascript
const command = `shaka-packager \\
  in=${videoPath},stream=video,segment_duration=2,format=hls \\
  --hls_master_playlist_output=${masterPlaylist}`;
```

- `segment_duration=2` - Creates 2-second chunks
- `stream=video` - Include video stream
- `format=hls` - Output HLS format

## Performance Optimization

### Bandwidth Detection

Shaka Player automatically detects available bandwidth and selects the appropriate quality. To test:

1. Open browser DevTools (F12)
2. Go to Network tab
3. Throttle connection speed (Chrome: Network → Throttling)
4. Observe video quality changes automatically

### Caching Considerations

HLS segments are typically cached by CDNs and browsers. For fresh content:
- Use versioned filenames
- Set appropriate cache headers
- Use `.ts` files with far-future expiry (segments are immutable)

### Disk Space

Estimate HLS size: ~500MB per hour of 1080p video

## Troubleshooting

### HLS Conversion Fails

**Symptoms:** Conversion endpoint returns error

**Solutions:**
1. Verify Shaka Packager is installed: `shaka-packager --version`
2. Check file exists: Verify MP4 is in `/public/uploads/videos/`
3. Check file permissions: Ensure write access to `/public/uploads/`
4. Check disk space: Ensure enough free disk space
5. Check video format: Ensure video is valid MP4

**Debug:**
```bash
# Test Shaka Packager directly
shaka-packager in=test.mp4,stream=video,format=hls --hls_master_playlist_output=test.m3u8
```

### Video Won't Play in HLS Mode

**Symptoms:** Falls back to MP4 or shows error

**Solutions:**
1. Check HLS directory exists: `/public/uploads/videos/{id}/`
2. Check manifest file: `{id}.m3u8` exists
3. Check segments: `.ts` files are created
4. Check browser console for CORS errors
5. Verify manifest is valid:
```bash
cat /public/uploads/videos/sessionid/sessionid.m3u8
```

### Slow Playback / Buffering

**Solutions:**
1. Increase buffer goal in config: `bufferingGoal: 12`
2. Check bandwidth: Use browser DevTools throttling
3. Use smaller segment duration (requires re-conversion)
4. Check server response time: `curl -I /uploads/videos/sessionid/segment_00001.ts`

## Monitoring & Analytics

### Watch History Integration

Currently tracked:
- Video start/stop times
- Current playback position
- Resume point

To extend tracking, update `/api/videos/[videoId]/progress`:

```javascript
// Track more metrics
- Average bitrate used
- Quality switches
- Buffering events
- Time to first byte
```

## Future Enhancements

1. **Multi-bitrate Encoding** - Create multiple quality levels
2. **Encryption** - Add DRM/CENC protection
3. **Closed Captions** - HLS subtitle support
4. **Live Streaming** - Live HLS with sliding window playlists
5. **Performance Analytics** - Track bandwidth usage and quality
6. **CDN Integration** - Distribute HLS segments via CDN

## References

- [Shaka Player Documentation](https://shaka-project.github.io/shaka-player/docs/api/index.html)
- [Shaka Packager GitHub](https://github.com/google/shaka-packager)
- [HLS Specification (RFC 8216)](https://tools.ietf.org/html/rfc8216)
- [MPEG-TS Format](https://en.wikipedia.org/wiki/MPEG_transport_stream)

## Support

For issues:
1. Check this documentation
2. Review browser console logs
3. Check server logs for conversion errors
4. Verify file permissions and disk space
5. Test with the sample videos first
