import React, { useEffect, useState } from 'react';
import styles from './VideoInfo.module.css';

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
      <div className={styles.container}>
        <div className={styles.loading}>Loading video information...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!videoData) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{videoData.title}</h2>
      <div className={styles.metadata}>
        <span className={styles.channel}>{videoData.channelTitle}</span>
      </div>
    </div>
  );
};

export default VideoInfo;
