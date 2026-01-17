import React from 'react';
import styles from './TimeControls.module.css';

interface TimeControlsProps {
  onSeek: (seconds: number) => void;
  disabled: boolean;
}

const TimeControls: React.FC<TimeControlsProps> = ({ onSeek, disabled }) => {
  const backwardButtons = [
    { label: '⏪ 10min', seconds: -600 },
    { label: '⏪ 5min', seconds: -300 },
    { label: '⏪ 1min', seconds: -60 },
    { label: '⏪ 10s', seconds: -10 },
  ];

  const forwardButtons = [
    { label: '⏩ 10s', seconds: 10 },
    { label: '⏩ 1min', seconds: 60 },
    { label: '⏩ 5min', seconds: 300 },
    { label: '⏩ 10min', seconds: 600 },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.title}>Backward</h3>
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
        <h3 className={styles.title}>Forward</h3>
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
