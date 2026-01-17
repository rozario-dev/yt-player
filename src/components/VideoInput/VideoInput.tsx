import React, { useState } from 'react';
import { extractVideoId } from '../../utils/youtubeHelper';
import styles from './VideoInput.module.css';

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
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter YouTube video URL"
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        Load Video
      </button>
    </form>
  );
};

export default VideoInput;
