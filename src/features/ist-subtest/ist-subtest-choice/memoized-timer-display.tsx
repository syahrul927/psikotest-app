import React from 'react';

interface MemoizedTimerDisplayProps {
  timeLeft: number;
  formatTime: (seconds: number) => string;
  isMemorizing: boolean;
}

export const MemoizedTimerDisplay = React.memo(function MemoizedTimerDisplay({
  timeLeft,
  formatTime,
  isMemorizing,
}: MemoizedTimerDisplayProps) {
  if (!isMemorizing) return null;

  return (
    <div className="text-center">
      <span
        className={`text-sm font-medium ${
          timeLeft <= 30 ? "text-red-500" : "text-blue-500"
        }`}
      >
        {formatTime(timeLeft)} tersisa
      </span>
    </div>
  );
});

MemoizedTimerDisplay.displayName = "MemoizedTimerDisplay";