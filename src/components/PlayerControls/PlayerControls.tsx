import React from 'react';
import TimeControls from './TimeControls';
import TimeJump from './TimeJump';
import { formatTime } from '../../utils/timeFormatter';

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
  const handleJumpToTime = (seconds: number) => {
    if (player && typeof player.seekTo === 'function') {
      player.seekTo(seconds, true);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-gray-700">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4">
        <div className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 whitespace-nowrap tabular-nums">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <button
            onClick={onPlayPause}
            disabled={!player}
            className="group relative px-10 py-3 text-base font-semibold bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl cursor-pointer transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed hover:from-red-700 hover:to-red-800 hover:shadow-lg hover:shadow-red-500/50 hover:scale-105 active:scale-95 w-full sm:w-auto overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isPlaying ? '▶️ Play' : '▶️ Play'}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-white/20 to-red-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          </button>

          <TimeJump onJump={handleJumpToTime} disabled={!player} />
        </div>
      </div>

      <TimeControls onSeek={onSeek} disabled={!player} />
    </div>
  );
};

export default PlayerControls;
