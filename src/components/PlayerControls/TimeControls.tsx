import React from 'react';

interface TimeControlsProps {
  onSeek: (seconds: number) => void;
  disabled: boolean;
}

const TimeControls: React.FC<TimeControlsProps> = ({ onSeek, disabled }) => {
  const backwardButtons = [
    { label: '<<< 10min', seconds: -600 },
    { label: '<< 5min', seconds: -300 },
    { label: '<< 1min', seconds: -60 },
    { label: '< 10s', seconds: -10 },
  ];

  const forwardButtons = [
    { label: '> 10s', seconds: 10 },
    { label: '>> 1min', seconds: 60 },
    { label: '>> 5min', seconds: 300 },
    { label: '>>> 10min', seconds: 600 },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2 justify-center">
        {backwardButtons.map((btn) => (
          <button
            key={btn.label}
            onClick={() => onSeek(btn.seconds)}
            disabled={disabled}
            className="px-4 py-2.5 text-sm font-medium bg-black text-white border border-white rounded-md cursor-pointer transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-900 hover:scale-105 active:scale-95"
          >
            {btn.label}
          </button>
        ))}
        {forwardButtons.map((btn) => (
          <button
            key={btn.label}
            onClick={() => onSeek(btn.seconds)}
            disabled={disabled}
            className="px-4 py-2.5 text-sm font-medium bg-black text-white border border-white rounded-md cursor-pointer transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-900 hover:scale-105 active:scale-95"
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeControls;
