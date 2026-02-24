import React, { useRef, useEffect } from 'react';
import shaka from "shaka-player"

export default function ShakaPlayer(){
    // const licenseServer = "https://widevine-proxy.appspot.com/proxy";
    const licenseServer = "https://license.uat.widevine.com/cenc/getcontentkey/widevine_test";
    const mpdFile = "https://dash.akamaized.net/dash264/TestCases/1c/qualcomm/2/MultiRate.mpd";
    const videoThumbnail = "https://upload.wikimedia.org/wikipedia/commons/a/a7/Big_Buck_Bunny_thumbnail_vlc.png";

    const videoRef = useRef(null);
    const playerRef = useRef(null);
  
    useEffect(() => {
      const initPlayer = async () => {
        // Create a Shaka Player instance
        const video = videoRef.current;
        const player = new shaka.Player(video);
        playerRef.current = player;
  
        // Listen for error events.
        player.addEventListener('error', onErrorEvent);
  
        // Configure the player for Widevine DRM
        player.configure({
          drm: {
            servers: {
              'com.widevine.alpha':licenseServer
            },
            advanced: {
              'com.widevine.alpha': {
                videoRobustness: 'SW_SECURE_DECODE',
                audioRobustness: 'SW_SECURE_CRYPTO',
                serverCertificate: new Uint8Array([]), // Add your server certificate if required
              },
            },
          },
        });
  
        // Load the manifest (replace with your actual manifest URL)
        try {
          await player.load(mpdFile);
          // console.log('The video has now been loaded!');
        } catch (e) {
          console.error('Error loading video', e);
        }
      };
  
      const onErrorEvent = (event) => {
        console.error('Error code', event.detail.code, 'object', event.detail);
      };
  
      initPlayer();
  
      return () => {
        if (playerRef.current) {
          playerRef.current.destroy();
        }
      };
    }, []);
  
    return (
      <div>
        <video
          ref={videoRef}
          width="640"
          controls
            controlsList="nodownload" 
            oncontextmenu="return false;"
            poster={videoThumbnail}
        />
      </div>
    );
};

