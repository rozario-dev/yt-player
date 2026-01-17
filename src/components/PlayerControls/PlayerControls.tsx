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
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
      </div>

      <TimeControls onSeek={onSeek} disabled={!player} />
    </div>
  );
};

export default PlayerControls;
