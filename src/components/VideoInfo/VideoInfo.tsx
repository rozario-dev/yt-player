import React, { useEffect, useState } from 'react';

interface VideoInfoProps {
  videoId: string;
}

interface VideoData {
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
}

const VideoInfo: React.FC<VideoInfoProps> = ({ videoId }) => {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchVideoInfo = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Using YouTube oEmbed API (no API key required)
        const oembedResponse = await fetch(
          `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
        );
        
        if (!oembedResponse.ok) {
          throw new Error('Failed to fetch video info');
        }
        
        const oembedData = await oembedResponse.json();
        
        setVideoData({
          title: oembedData.title || 'Unknown Title',
          description: '',
          channelTitle: oembedData.author_name || 'Unknown Channel',
          publishedAt: '',
          viewCount: ''
        });
      } catch (err) {
        console.error('Error fetching video info:', err);
        setError('Failed to load video information');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoInfo();
    }
  }, [videoId]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 mb-6 border border-gray-700">
        <div className="flex items-center justify-center gap-3">
          <div className="w-6 h-6 border-3 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading video info...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 backdrop-blur-sm rounded-xl p-6 mb-6">
        <p className="text-red-400 text-center">{error}</p>
      </div>
    );
  }

  if (!videoData) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 md:p-5 mb-4 border border-gray-700 hover:border-gray-600 transition-colors">
      <h2 className="text-white text-lg md:text-xl font-bold mb-2 leading-tight">{videoData.title}</h2>
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <span className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
          </svg>
          {videoData.channelTitle}
        </span>
      </div>
    </div>
  );
};

export default VideoInfo;
