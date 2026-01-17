import { useState, useEffect } from 'react';
import VideoInput from './components/VideoInput/VideoInput';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import PlayerControls from './components/PlayerControls/PlayerControls';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import './App.css';

function App() {
  const [videoId, setVideoId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const adsenseClientId = import.meta.env.VITE_ADSENSE_CLIENT_ID;
  const adsenseSlotId = import.meta.env.VITE_ADSENSE_SLOT_ID;
  
  const {
    playerRef,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    seekTo,
    togglePlayPause
  } = useYouTubePlayer();

  useEffect(() => {
    if (!playerRef.current) return;

    const interval = setInterval(() => {
      if (playerRef.current) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [playerRef.current, setCurrentTime]);

  useEffect(() => {
    // 动态加载Google AdSense脚本
    if (adsenseClientId) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);

      script.onload = () => {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        } catch (e) {
          console.error('AdSense error:', e);
        }
      };
    }
  }, [adsenseClientId]);

  const handleReady = (event: any) => {
    playerRef.current = event.target;
    setDuration(event.target.getDuration());
  };

  const handleStateChange = (event: any) => {
    // YouTube Player States: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
    setIsPlaying(event.data === 1);
  };

  const handleError = (event: any) => {
    setError('Failed to load video');
    console.error('YouTube Player Error:', event);
  };

  return (
    <div className="app">
      <header className="app-header">
        <img src="/logo.svg" alt="Logo" className="app-logo" />
        <h1>YouTube Video Player</h1>
      </header>

      <main className="app-main">
        <VideoInput
          onVideoIdChange={setVideoId}
          onError={setError}
        />

        {error && <div className="error-message">{error}</div>}

        {videoId && (
          <>
            <VideoPlayer
              videoId={videoId}
              onReady={handleReady}
              onStateChange={handleStateChange}
              onError={handleError}
            />

            <PlayerControls
              player={playerRef.current}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              onPlayPause={togglePlayPause}
              onSeek={seekTo}
            />
          </>
        )}

        {/* Google AdSense Ad Container */}
        {adsenseClientId && adsenseSlotId && (
          <div className="ad-container">
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client={adsenseClientId}
                 data-ad-slot={adsenseSlotId}
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
