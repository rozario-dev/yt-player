import React from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

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
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 0,
      controls: 1,
      modestbranding: 1,
    },
  };

  return (
    <div className="relative w-full mx-auto bg-black rounded-2xl overflow-hidden shadow-2xl shadow-red-500/20 ring-2 ring-gray-800">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute inset-0">
          <YouTube
            videoId={videoId}
            opts={opts}
            onReady={onReady}
            onStateChange={onStateChange}
            onError={onError}
            className="w-full h-full"
            iframeClassName="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
