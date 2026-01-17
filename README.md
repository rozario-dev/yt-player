# YouTube视频播放器

一个基于React + TypeScript + Vite的YouTube视频播放器Web应用，支持自定义时间跳转控制。

## 功能特性

- ✅ 输入YouTube视频URL进行播放
- ✅ 流式播放YouTube视频
- ✅ 基础播放控制（播放/暂停）
- ✅ 8个自定义时间跳转按钮：
  - 后退：-10秒、-1分钟、-5分钟、-10分钟
  - 前进：+10秒、+1分钟、+5分钟、+10分钟
- ✅ 实时显示播放时间和总时长
- ✅ 响应式设计，支持移动端和桌面端
- ✅ 精美的Logo设计
- ✅ 集成谷歌广告支持

## 技术栈

- **构建工具**: Vite 5.x
- **前端框架**: React 18.x
- **编程语言**: TypeScript 5.x
- **YouTube集成**: react-youtube + YouTube IFrame Player API

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

应用将在 http://localhost:5173 启动

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 使用方法

1. 在输入框中粘贴YouTube视频URL
2. 点击"加载视频"按钮
3. 使用播放/暂停按钮控制播放
4. 使用时间跳转按钮快速定位到视频的不同位置

## 谷歌广告配置

要启用谷歌广告功能并开始赚取收入，请按以下步骤操作：

1. 在 [Google AdSense](https://www.google.com/adsense/) 注册账号并获得批准
2. 获取你的发布商ID（格式：`ca-pub-XXXXXXXXXXXXXXXX`）
3. 复制 [`.env.example`](.env.example:1) 文件为 `.env`：
   ```bash
   cp .env.example .env
   ```
4. 在 [`.env`](.env:4) 文件中配置你的广告参数：
   - `VITE_ADSENSE_CLIENT_ID`: 你的发布商ID
   - `VITE_ADSENSE_SLOT_ID`: 你的广告位ID（在AdSense后台创建广告单元后获得）

**注意**: 
- 广告需要在生产环境中才能正常显示，开发环境下可能看不到广告内容
- `.env` 文件已添加到 [`.gitignore`](.gitignore:30) 中，不会被提交到版本控制
- 部署到生产环境时，需要在服务器或托管平台的环境变量中配置这些值

## 支持的URL格式

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`

## 项目结构

```
yt-player/
├── plans/                          # 规划文档
├── src/
│   ├── components/                 # React组件
│   │   ├── VideoInput/            # URL输入组件
│   │   ├── VideoPlayer/           # 视频播放器组件
│   │   └── PlayerControls/        # 播放控制组件
│   ├── hooks/                     # 自定义Hooks
│   │   └── useYouTubePlayer.ts   # 播放器状态管理
│   ├── utils/                     # 工具函数
│   │   ├── youtubeHelper.ts      # YouTube URL解析
│   │   └── timeFormatter.ts      # 时间格式化
│   ├── App.tsx                    # 根组件
│   └── main.tsx                   # 入口文件
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 许可证

MIT
