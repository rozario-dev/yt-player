# YouTube播放器快速参考指南

## 快速开始命令

```bash
# 创建项目
npm create vite@latest yt-player -- --template react-ts

# 进入项目目录
cd yt-player

# 安装依赖
npm install

# 安装react-youtube
npm install react-youtube

# 安装类型定义
npm install --save-dev @types/youtube

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 核心代码片段

### 1. YouTube URL解析

```typescript
// utils/youtubeHelper.ts
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  
  return null;
}

export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}
```

### 2. 时间格式化

```typescript
// utils/timeFormatter.ts
export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  
  return `${m}:${s.toString().padStart(2, '0')}`;
}
```

### 3. YouTube播放器Hook

```typescript
// hooks/useYouTubePlayer.ts
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
```

### 4. VideoInput组件

```typescript
// components/VideoInput/VideoInput.tsx
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
      onError('无效的YouTube URL');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="输入YouTube视频URL"
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        加载视频
      </button>
    </form>
  );
};

export default VideoInput;
```

### 5. VideoPlayer组件

```typescript
// components/VideoPlayer/VideoPlayer.tsx
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
```

### 6. TimeControls组件

```typescript
// components/PlayerControls/TimeControls.tsx
import React from 'react';
import styles from './TimeControls.module.css';

interface TimeControlsProps {
  onSeek: (seconds: number) => void;
  disabled: boolean;
}

const TimeControls: React.FC<TimeControlsProps> = ({ onSeek, disabled }) => {
  const backwardButtons = [
    { label: '-10分钟', seconds: -600 },
    { label: '-5分钟', seconds: -300 },
    { label: '-1分钟', seconds: -60 },
    { label: '-10秒', seconds: -10 },
  ];

  const forwardButtons = [
    { label: '+10秒', seconds: 10 },
    { label: '+1分钟', seconds: 60 },
    { label: '+5分钟', seconds: 300 },
    { label: '+10分钟', seconds: 600 },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.title}>后退</h3>
        <div className={styles.buttonGroup}>
          {backwardButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => onSeek(btn.seconds)}
              disabled={disabled}
              className={`${styles.button} ${styles.backward}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.title}>前进</h3>
        <div className={styles.buttonGroup}>
          {forwardButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => onSeek(btn.seconds)}
              disabled={disabled}
              className={`${styles.button} ${styles.forward}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeControls;
```

### 7. PlayerControls组件

```typescript
// components/PlayerControls/PlayerControls.tsx
import React from 'react';
import TimeControls from './TimeControls';
import { formatTime } from '../../utils/timeFormatter';
import styles from './PlayerControls.module.css';

interface PlayerControlsProps {
  player: any;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onSeek: (seconds: number) => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  player,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.timeDisplay}>
        <span>{formatTime(currentTime)}</span>
        <span> / </span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className={styles.basicControls}>
        <button
          onClick={onPlayPause}
          disabled={!player}
          className={styles.playButton}
        >
          {isPlaying ? '暂停' : '播放'}
        </button>
      </div>

      <TimeControls onSeek={onSeek} disabled={!player} />
    </div>
  );
};

export default PlayerControls;
```

### 8. App组件

```typescript
// App.tsx
import React, { useState, useEffect } from 'react';
import VideoInput from './components/VideoInput/VideoInput';
import VideoPlayer from './components/VideoPlayer/VideoPlayer';
import PlayerControls from './components/PlayerControls/PlayerControls';
import { useYouTubePlayer } from './hooks/useYouTubePlayer';
import './App.css';

function App() {
  const [videoId, setVideoId] = useState<string>('');
  const [error, setError] = useState<string>('');
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
  }, [playerRef.current]);

  const handleReady = (event: any) => {
    playerRef.current = event.target;
    setDuration(event.target.getDuration());
  };

  const handleStateChange = (event: any) => {
    // YouTube Player States: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (cued)
    setIsPlaying(event.data === 1);
  };

  const handleError = (event: any) => {
    setError('视频加载失败');
    console.error('YouTube Player Error:', event);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>YouTube视频播放器</h1>
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
      </main>
    </div>
  );
}

export default App;
```

## 样式示例

### App.css
```css
.app {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.app-header {
  background-color: #282c34;
  padding: 2rem;
  color: white;
  text-align: center;
}

.app-header h1 {
  margin: 0;
  font-size: 2rem;
}

.app-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
  text-align: center;
}
```

### VideoInput.module.css
```css
.form {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  outline: none;
  transition: border-color 0.3s;
}

.input:focus {
  border-color: #007bff;
}

.button {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:hover {
  background-color: #0056b3;
}

.button:active {
  transform: translateY(1px);
}
```

### VideoPlayer.module.css
```css
.container {
  position: relative;
  width: 100%;
  max-width: 854px;
  margin: 0 auto 2rem;
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .container {
    max-width: 100%;
  }
}
```

### PlayerControls.module.css
```css
.container {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timeDisplay {
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

.basicControls {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.playButton {
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.playButton:hover:not(:disabled) {
  background-color: #218838;
  transform: scale(1.05);
}

.playButton:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
```

### TimeControls.module.css
```css
.container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.title {
  margin: 0;
  font-size: 1rem;
  color: #666;
  text-align: center;
}

.buttonGroup {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
}

.button {
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.backward {
  background-color: #007bff;
  color: white;
}

.backward:hover:not(:disabled) {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 123, 255, 0.3);
}

.forward {
  background-color: #28a745;
  color: white;
}

.forward:hover:not(:disabled) {
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3);
}

@media (max-width: 768px) {
  .buttonGroup {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## YouTube Player API参考

### 播放器状态
```typescript
enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5
}
```

### 常用方法
```typescript
// 播放控制
player.playVideo()           // 播放
player.pauseVideo()          // 暂停
player.stopVideo()           // 停止

// 时间控制
player.seekTo(seconds, allowSeekAhead)  // 跳转到指定时间
player.getCurrentTime()                  // 获取当前时间
player.getDuration()                     // 获取总时长

// 音量控制
player.setVolume(volume)     // 设置音量 (0-100)
player.getVolume()           // 获取音量
player.mute()                // 静音
player.unMute()              // 取消静音

// 播放速度
player.setPlaybackRate(rate) // 设置播放速度
player.getPlaybackRate()     // 获取播放速度

// 状态查询
player.getPlayerState()      // 获取播放器状态
```

## 常见问题解决

### 1. 视频无法播放
```typescript
// 检查视频是否可嵌入
// 某些视频禁止嵌入，需要处理错误
const handleError = (event: any) => {
  if (event.data === 150) {
    setError('该视频不允许嵌入播放');
  } else {
    setError('视频加载失败');
  }
};
```

### 2. 自动播放被阻止
```typescript
// 现代浏览器限制自动播放
// 需要用户交互后才能播放
const opts = {
  playerVars: {
    autoplay: 0, // 不自动播放
  },
};
```

### 3. 移动端适配
```css
/* 响应式视频容器 */
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

## 部署命令

```bash
# 构建
npm run build

# 部署到Vercel
npx vercel

# 部署到Netlify
npx netlify deploy --prod

# 部署到GitHub Pages
npm run build
git add dist -f
git commit -m "Deploy"
git subtree push --prefix dist origin gh-pages
```

## 环境变量示例

```bash
# .env
VITE_APP_TITLE=YouTube播放器
VITE_YOUTUBE_API_KEY=your_api_key_here

# .env.example
VITE_APP_TITLE=YouTube播放器
VITE_YOUTUBE_API_KEY=
```

## 有用的链接

- [YouTube IFrame Player API文档](https://developers.google.com/youtube/iframe_api_reference)
- [react-youtube GitHub](https://github.com/tjallingt/react-youtube)
- [Vite文档](https://vitejs.dev/)
- [React文档](https://react.dev/)
- [TypeScript文档](https://www.typescriptlang.org/)

## 快速调试技巧

```typescript
// 在控制台查看播放器状态
console.log('Player State:', player.getPlayerState());
console.log('Current Time:', player.getCurrentTime());
console.log('Duration:', player.getDuration());

// 监听所有播放器事件
const handleStateChange = (event: any) => {
  console.log('State changed:', event.data);
};
```
