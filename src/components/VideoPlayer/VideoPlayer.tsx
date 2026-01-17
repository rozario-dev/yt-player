import React from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import styles from './VideoPlayer.module.css';

interface VideoPlayerProps {
  videoId: string;
  onReady: (event: any) => void;
  onStateChange: (event: any) => void;
  onError: (event: any) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  onReady,
  onStateChange,
  onError
}) => {
  const opts: YouTubeProps['opts'] = {
    height: '480',
    width: '854',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
    },
  };

  return (
    <div className={styles.container}>
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        onStateChange={onStateChange}
        onError={onError}
      />
    </div>
  );
};

export default VideoPlayer;
