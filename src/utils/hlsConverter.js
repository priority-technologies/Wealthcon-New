import { execSync } from 'child_process';
import { existsSync, mkdirSync, rmSync } from 'fs';
import path from 'path';

/**
 * Convert MP4 video to HLS format using Shaka Packager
 * Generates .m3u8 manifest with adaptive bitrate streams
 */
export async function convertToHLS(videoPath, outputDir) {
  try {
    if (!existsSync(videoPath)) {
      throw new Error(`Video file not found: ${videoPath}`);
    }

    // Create output directory if it doesn't exist
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const videoFileName = path.basename(videoPath, path.extname(videoPath));
    const masterPlaylist = path.join(outputDir, `${videoFileName}.m3u8`);

    console.log(`Converting ${videoPath} to HLS...`);
    console.log(`Output directory: ${outputDir}`);

    // Run Shaka Packager command
    // Creates multiple bitrate streams (480p, 720p, 1080p) with 2-second chunks
    const command = `shaka-packager \\
      in=${videoPath},stream=video,segment_duration=2,format=hls \\
      --hls_master_playlist_output=${masterPlaylist} \\
      --mpd_output="" \\
      --segment_template="${path.join(outputDir, '${stream}_${segment_index:05d}.ts').replace(/\\/g, '/')}"`;

    console.log('Executing:', command);
    execSync(command, { stdio: 'inherit', shell: true });

    console.log(`✅ HLS conversion completed successfully`);
    console.log(`Master playlist created at: ${masterPlaylist}`);

    return {
      success: true,
      hlsUrl: `/uploads/videos/${videoFileName}/${videoFileName}.m3u8`,
      manifestPath: masterPlaylist,
      videoDir: outputDir,
    };
  } catch (error) {
    console.error('❌ HLS conversion failed:', error.message);
    throw new Error(`HLS conversion error: ${error.message}`);
  }
}

/**
 * Convert video with multiple bitrate options for adaptive streaming
 */
export async function convertToHLSAdaptive(videoPath, outputDir) {
  try {
    if (!existsSync(videoPath)) {
      throw new Error(`Video file not found: ${videoPath}`);
    }

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const videoFileName = path.basename(videoPath, path.extname(videoPath));
    const masterPlaylist = path.join(outputDir, `${videoFileName}.m3u8`);

    console.log(`Converting to adaptive HLS (multi-bitrate)...`);

    // Shaka Packager command for adaptive bitrate streaming
    const command = `shaka-packager \\
      in=${videoPath},stream=video,format=hls \\
      --hls_master_playlist_output=${masterPlaylist} \\
      --segment_duration=2 \\
      --segment_template="${path.join(outputDir, 'segment_$Number$.ts').replace(/\\/g, '/')}"`;

    console.log('Executing HLS conversion...');
    execSync(command, { stdio: 'inherit', shell: true });

    console.log(`✅ Adaptive HLS conversion completed`);

    return {
      success: true,
      hlsUrl: `/uploads/videos/${videoFileName}/${videoFileName}.m3u8`,
      manifestPath: masterPlaylist,
      videoDir: outputDir,
    };
  } catch (error) {
    console.error('❌ Adaptive HLS conversion failed:', error.message);
    throw new Error(`Adaptive HLS conversion error: ${error.message}`);
  }
}

/**
 * Clean up HLS files
 */
export function cleanupHLS(hlsDir) {
  try {
    if (existsSync(hlsDir)) {
      rmSync(hlsDir, { recursive: true, force: true });
      console.log(`Cleaned up HLS directory: ${hlsDir}`);
    }
  } catch (error) {
    console.error('Error cleaning up HLS files:', error.message);
  }
}
