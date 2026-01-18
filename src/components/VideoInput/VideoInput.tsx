import React, { useState } from 'react';
import { extractVideoId } from '../../utils/youtubeHelper';

interface VideoInputProps {
  onVideoIdChange: (videoId: string) => void;
  onError: (error: string) => void;
}

const VideoInput: React.FC<VideoInputProps> = ({ onVideoIdChange, onError }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const videoId = extractVideoId(url);
    if (videoId) {
      onVideoIdChange(videoId);
      onError('');
    } else {
      onError('Invalid YouTube URL');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="flex-1 relative group">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube video URL..."
          className="w-full px-4 py-3 text-base bg-gray-800/50 text-white border-2 border-gray-700 rounded-xl outline-none transition-all duration-300 placeholder:text-gray-500 focus:border-red-500 focus:bg-gray-800/80 focus:shadow-lg focus:shadow-red-500/20 backdrop-blur-sm"
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/0 via-red-500/5 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      </div>
      <button
        type="submit"
        className="px-8 py-3 text-base font-semibold bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl cursor-pointer transition-all duration-300 hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:shadow-red-500/50 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 whitespace-nowrap"
      >
        Load Video
      </button>
    </form>
  );
};

export default VideoInput;
