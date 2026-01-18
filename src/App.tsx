import { useState, useEffect } from 'react';
import VideoInput from './components/VideoInput/VideoInput';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import VideoInfo from './components/VideoInfo/VideoInfo';
import PlayerControls from './components/PlayerControls/PlayerControls';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
      <header className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-3">
            <img src="/logo.svg" alt="Logo" className="w-10 h-10 md:w-12 md:h-12 drop-shadow-lg animate-pulse" />
            <h1 className="text-xl md:text-3xl font-bold text-white tracking-tight">
              YouTube Video Player
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-start justify-center px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        <div className="w-full max-w-5xl">
          <VideoInput
            onVideoIdChange={setVideoId}
            onError={setError}
          />

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-6 py-4 rounded-xl text-center my-6 backdrop-blur-sm animate-shake">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {videoId && (
            <div className="space-y-5">
              <VideoInfo videoId={videoId} />
              
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
            </div>
          )}

          {/* Google AdSense Ad Container */}
          {adsenseClientId && adsenseSlotId && (
            <div className="mt-10 min-h-[100px] flex justify-center items-center">
              <ins className="adsbygoogle"
                   style={{ display: 'block' }}
                   data-ad-client={adsenseClientId}
                   data-ad-slot={adsenseSlotId}
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
