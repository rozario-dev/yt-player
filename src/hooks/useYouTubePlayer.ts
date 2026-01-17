import { useState, useRef, useCallback } from 'react';

export function useYouTubePlayer() {
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const seekTo = useCallback((offsetSeconds: number) => {
    if (!playerRef.current) return;
    
    const current = playerRef.current.getCurrentTime();
    const newTime = Math.max(0, Math.min(current + offsetSeconds, duration));
    
    playerRef.current.seekTo(newTime, true);
  }, [duration]);

  const togglePlayPause = useCallback(() => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, [isPlaying]);

  return {
    playerRef,
    isPlaying,
    setIsPlaying,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    seekTo,
    togglePlayPause
  };
}
