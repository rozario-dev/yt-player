# YouTube播放器开发规范

## 代码规范

### 1. TypeScript规范

#### 类型定义
```typescript
// ✅ 推荐：使用interface定义对象类型
interface VideoPlayerProps {
  videoId: string;
  onReady: (player: YouTubePlayer) => void;
}

// ✅ 推荐：使用type定义联合类型和工具类型
type PlayerState = 'unstarted' | 'ended' | 'playing' | 'paused' | 'buffering' | 'cued';
type SeekDirection = 'forward' | 'backward';

// ❌ 避免：使用any类型
const handleClick = (event: any) => {}; // 不推荐

// ✅ 推荐：明确类型
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {};
```

#### 严格模式配置
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### 2. React组件规范

#### 函数组件定义
```typescript
// ✅ 推荐：使用函数声明 + React.FC（可选）
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, disabled = false }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;
```

#### Hooks使用规范
```typescript
// ✅ 推荐：自定义Hook命名以use开头
export function useYouTubePlayer() {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Hook逻辑
  
  return { player, isPlaying, setPlayer, setIsPlaying };
}

// ✅ 推荐：使用useCallback缓存回调函数
const handleSeek = useCallback((seconds: number) => {
  if (!player) return;
  const currentTime = player.getCurrentTime();
  player.seekTo(currentTime + seconds, true);
}, [player]);

// ✅ 推荐：使用useMemo缓存计算结果
const formattedTime = useMemo(() => {
  return formatTime(currentTime);
}, [currentTime]);
```

#### 组件文件结构
```typescript
// VideoPlayer.tsx
import React, { useEffect, useRef, useState } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';
import styles from './VideoPlayer.module.css';

// 1. 类型定义
interface VideoPlayerProps {
  videoId: string;
  onReady: (player: YouTubePlayer) => void;
}

// 2. 常量定义
const PLAYER_OPTIONS = {
  height: '390',
  width: '640',
  playerVars: {
    autoplay: 0,
  },
};

// 3. 组件定义
const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoId, onReady }) => {
  // 3.1 Hooks
  const [isLoading, setIsLoading] = useState(true);
  const playerRef = useRef<YouTubePlayer | null>(null);
  
  // 3.2 副作用
  useEffect(() => {
    // 副作用逻辑
  }, [videoId]);
  
  // 3.3 事件处理函数
  const handleReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
    onReady(event.target);
    setIsLoading(false);
  };
  
  // 3.4 渲染
  return (
    <div className={styles.container}>
      {isLoading && <div className={styles.loading}>加载中...</div>}
      <YouTube
        videoId={videoId}
        opts={PLAYER_OPTIONS}
        onReady={handleReady}
      />
    </div>
  );
};

// 4. 导出
export default VideoPlayer;
```

### 3. 命名规范

#### 文件命名
```
✅ 推荐：
- 组件文件：PascalCase
  VideoPlayer.tsx
  TimeControls.tsx
  
- 工具文件：camelCase
  youtubeHelper.ts
  timeFormatter.ts
  
- Hook文件：camelCase（use前缀）
  useYouTubePlayer.ts
  useVideoUrl.ts
  
- 样式文件：与组件同名
  VideoPlayer.module.css
  TimeControls.module.css
```

#### 变量和函数命名
```typescript
// ✅ 推荐：变量使用camelCase
const videoId = 'dQw4w9WgXcQ';
const isPlaying = true;
const currentTime = 120;

// ✅ 推荐：常量使用UPPER_SNAKE_CASE
const MAX_VOLUME = 100;
const DEFAULT_SEEK_TIME = 10;
const API_BASE_URL = 'https://api.example.com';

// ✅ 推荐：函数使用camelCase，动词开头
const handleClick = () => {};
const fetchVideoData = async () => {};
const validateUrl = (url: string) => {};

// ✅ 推荐：布尔值使用is/has/can前缀
const isValid = true;
const hasError = false;
const canPlay = true;

// ✅ 推荐：事件处理函数使用handle前缀
const handlePlayPause = () => {};
const handleSeekForward = () => {};
const handleVolumeChange = () => {};
```

#### 组件Props命名
```typescript
// ✅ 推荐：回调函数使用on前缀
interface ComponentProps {
  onReady: () => void;
  onError: (error: Error) => void;
  onChange: (value: string) => void;
}

// ✅ 推荐：布尔Props不使用is前缀（JSX中更简洁）
interface ButtonProps {
  disabled?: boolean;  // <Button disabled />
  loading?: boolean;   // <Button loading />
}
```

### 4. CSS规范

#### CSS Modules使用
```css
/* VideoPlayer.module.css */

/* ✅ 推荐：使用camelCase命名类 */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.videoWrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
}

/* ✅ 推荐：使用BEM命名嵌套元素 */
.controls {
  display: flex;
  gap: 1rem;
}

.controls__button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.controls__button--primary {
  background-color: #007bff;
  color: white;
}
```

#### 响应式设计
```css
/* ✅ 推荐：移动优先设计 */
.container {
  padding: 1rem;
}

/* 平板 */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* 桌面 */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}
```

### 5. 错误处理规范

#### 错误边界
```typescript
// ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>出错了</h2>
          <p>{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

#### Try-Catch使用
```typescript
// ✅ 推荐：异步操作使用try-catch
const fetchVideoData = async (videoId: string) => {
  try {
    const response = await fetch(`/api/videos/${videoId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch video data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching video:', error);
    throw error; // 重新抛出以便上层处理
  }
};

// ✅ 推荐：提供用户友好的错误消息
const handleError = (error: unknown) => {
  let message = '发生未知错误';
  
  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }
  
  setErrorMessage(message);
};
```

### 6. 注释规范

#### JSDoc注释
```typescript
/**
 * 从YouTube URL中提取视频ID
 * @param url - YouTube视频URL
 * @returns 视频ID，如果URL无效则返回null
 * @example
 * extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
 * // returns 'dQw4w9WgXcQ'
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * 格式化秒数为时间字符串
 * @param seconds - 秒数
 * @returns 格式化的时间字符串 (HH:MM:SS 或 MM:SS)
 */
export function formatTime(seconds: number): string {
  // 实现...
}
```

#### 行内注释
```typescript
// ✅ 推荐：解释为什么这样做
// 使用防抖避免频繁更新导致性能问题
const debouncedUpdate = debounce(updateTime, 100);

// ✅ 推荐：标记待办事项
// TODO: 添加播放列表支持
// FIXME: 修复Safari浏览器的自动播放问题
// NOTE: YouTube API限制每秒最多10次请求

// ❌ 避免：注释显而易见的代码
// 设置isPlaying为true
setIsPlaying(true); // 不需要这样的注释
```

### 7. Git提交规范

#### 提交消息格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

#### 类型说明
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整（不影响功能）
refactor: 代码重构
perf: 性能优化
test: 测试相关
chore: 构建/工具相关
```

#### 示例
```bash
# 好的提交消息
git commit -m "feat(player): 添加时间跳转按钮"
git commit -m "fix(input): 修复URL验证正则表达式"
git commit -m "docs(readme): 更新安装说明"
git commit -m "refactor(hooks): 优化useYouTubePlayer性能"

# 详细的提交消息
git commit -m "feat(controls): 添加播放速度控制

- 添加速度选择下拉菜单
- 支持0.5x, 1x, 1.5x, 2x速度
- 保存用户选择的速度偏好

Closes #123"
```

### 8. 测试规范

#### 单元测试
```typescript
// youtubeHelper.test.ts
import { extractVideoId, isValidYouTubeUrl } from './youtubeHelper';

describe('youtubeHelper', () => {
  describe('extractVideoId', () => {
    it('should extract video ID from standard URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should extract video ID from short URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ';
      expect(extractVideoId(url)).toBe('dQw4w9WgXcQ');
    });

    it('should return null for invalid URL', () => {
      const url = 'https://example.com';
      expect(extractVideoId(url)).toBeNull();
    });
  });
});
```

#### 组件测试
```typescript
// VideoPlayer.test.tsx
import { render, screen } from '@testing-library/react';
import VideoPlayer from './VideoPlayer';

describe('VideoPlayer', () => {
  it('should render loading state initially', () => {
    render(<VideoPlayer videoId="test123" onReady={() => {}} />);
    expect(screen.getByText('加载中...')).toBeInTheDocument();
  });

  it('should call onReady when player is ready', async () => {
    const onReady = jest.fn();
    render(<VideoPlayer videoId="test123" onReady={onReady} />);
    
    // 等待播放器加载
    await waitFor(() => {
      expect(onReady).toHaveBeenCalled();
    });
  });
});
```

### 9. 性能优化规范

#### React性能优化
```typescript
// ✅ 推荐：使用React.memo避免不必要的重渲染
const TimeButton = React.memo<TimeButtonProps>(({ label, onClick, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
});

// ✅ 推荐：使用useCallback缓存函数
const handleSeekForward = useCallback((seconds: number) => {
  if (!player) return;
  player.seekTo(player.getCurrentTime() + seconds, true);
}, [player]);

// ✅ 推荐：使用useMemo缓存计算结果
const timeButtons = useMemo(() => [
  { label: '+10s', seconds: 10 },
  { label: '+1m', seconds: 60 },
  { label: '+5m', seconds: 300 },
  { label: '+10m', seconds: 600 },
], []);
```

#### 代码分割
```typescript
// ✅ 推荐：使用React.lazy进行代码分割
const PlayerControls = React.lazy(() => import('./PlayerControls'));

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <PlayerControls />
    </Suspense>
  );
}
```

### 10. 安全规范

#### XSS防护
```typescript
// ✅ 推荐：验证和清理用户输入
const sanitizeUrl = (url: string): string => {
  // 只允许YouTube域名
  const allowedDomains = ['youtube.com', 'youtu.be'];
  try {
    const urlObj = new URL(url);
    if (!allowedDomains.some(domain => urlObj.hostname.includes(domain))) {
      throw new Error('Invalid domain');
    }
    return url;
  } catch {
    throw new Error('Invalid URL');
  }
};

// ❌ 避免：直接使用dangerouslySetInnerHTML
// 除非绝对必要且内容已经过清理
```

#### 环境变量
```typescript
// ✅ 推荐：使用环境变量存储敏感信息
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// .env.example
VITE_YOUTUBE_API_KEY=your_api_key_here
```

### 11. 文档规范

#### README.md结构
```markdown
# 项目名称

简短描述

## 功能特性

- 功能1
- 功能2

## 技术栈

- React 18
- TypeScript 5
- Vite 5

## 快速开始

### 安装
\`\`\`bash
npm install
\`\`\`

### 开发
\`\`\`bash
npm run dev
\`\`\`

### 构建
\`\`\`bash
npm run build
\`\`\`

## 项目结构

## 贡献指南

## 许可证
```

#### 组件文档
```typescript
/**
 * VideoPlayer组件
 * 
 * 用于播放YouTube视频的组件，基于YouTube IFrame Player API
 * 
 * @component
 * @example
 * ```tsx
 * <VideoPlayer
 *   videoId="dQw4w9WgXcQ"
 *   onReady={(player) => console.log('Player ready', player)}
 *   onError={(error) => console.error('Player error', error)}
 * />
 * ```
 */
```

## 代码审查清单

在提交代码前，请确保：

- [ ] 代码符合TypeScript严格模式
- [ ] 所有函数和组件都有适当的类型定义
- [ ] 使用了适当的React Hooks优化
- [ ] 添加了必要的错误处理
- [ ] 代码有适当的注释
- [ ] 遵循命名规范
- [ ] 通过ESLint检查
- [ ] 通过Prettier格式化
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] Git提交消息符合规范

## 工具配置

### ESLint配置
```json
{
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Prettier配置
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

## 总结

遵循这些规范可以确保：
1. 代码质量和可维护性
2. 团队协作效率
3. 项目长期稳定性
4. 良好的开发体验
