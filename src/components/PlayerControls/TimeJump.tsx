import React, { useState } from 'react';

interface TimeJumpProps {
  onJump: (seconds: number) => void;
  disabled: boolean;
}

const TimeJump: React.FC<TimeJumpProps> = ({ onJump, disabled }) => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const handleJump = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    
    const totalSeconds = h * 3600 + m * 60 + s;
    
    if (totalSeconds >= 0) {
      onJump(totalSeconds);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJump();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
      <div className="flex items-center gap-2 bg-gray-700/50 border border-gray-600 rounded-xl px-3 py-2 backdrop-blur-sm w-full sm:w-auto">
        <input
          type="number"
          min="0"
          placeholder="H"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="w-12 px-1 py-1.5 text-sm bg-gray-800/50 text-white border border-gray-600 rounded-lg text-center outline-none disabled:opacity-30 disabled:cursor-not-allowed placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-gray-400 text-sm">:</span>
        <input
          type="number"
          min="0"
          max="59"
          placeholder="M"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="w-12 px-1 py-1.5 text-sm bg-gray-800/50 text-white border border-gray-600 rounded-lg text-center outline-none disabled:opacity-30 disabled:cursor-not-allowed placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <span className="text-gray-400 text-sm">:</span>
        <input
          type="number"
          min="0"
          max="59"
          placeholder="S"
          value={seconds}
          onChange={(e) => setSeconds(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          className="w-12 px-1 py-1.5 text-sm bg-gray-800/50 text-white border border-gray-600 rounded-lg text-center outline-none disabled:opacity-30 disabled:cursor-not-allowed placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
      <button
        onClick={handleJump}
        disabled={disabled}
        className="px-8 py-2 text-sm font-semibold bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-xl cursor-pointer transition-all duration-300 hover:from-gray-600 hover:to-gray-700 hover:shadow-lg hover:shadow-gray-500/30 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed w-full sm:w-auto whitespace-nowrap"
      >
        ⏱️ Jump
      </button>
    </div>
  );
};

export default TimeJump;
