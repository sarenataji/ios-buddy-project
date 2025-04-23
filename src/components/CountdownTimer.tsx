
import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
}

const CountdownTimer = ({ targetDate, onComplete }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    progress: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        // Target date has passed
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, progress: 100 });
        if (onComplete) onComplete();
        return;
      }
      
      // Calculate hours, minutes, seconds
      const hours = Math.floor(difference / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      // Calculate progress - assuming the event was set within a 24-hour period
      const totalSecondsIn24Hours = 24 * 60 * 60;
      const totalSecondsLeft = hours * 3600 + minutes * 60 + seconds;
      const progress = 100 - Math.min(100, (totalSecondsLeft / totalSecondsIn24Hours) * 100);
      
      setTimeLeft({ hours, minutes, seconds, progress });
    };
    
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);
  
  // Format time units to always have two digits
  const formatTimeUnit = (unit: number) => unit.toString().padStart(2, "0");
  
  return (
    <div className="flex items-center w-full gap-4">
      {/* Horizontal countdown display */}
      <div className="font-mono text-xl text-[#edd6ae] tracking-wider flex items-baseline gap-1">
        <span className="text-[#edd6ae] font-medium">{formatTimeUnit(timeLeft.hours)}</span>
        <span className="text-[#e8c282aa] text-sm">h</span>
        <span className="text-[#edd6ae] font-medium">{formatTimeUnit(timeLeft.minutes)}</span>
        <span className="text-[#e8c282aa] text-sm">m</span>
        <span className="text-[#edd6ae] font-medium">{formatTimeUnit(timeLeft.seconds)}</span>
        <span className="text-[#e8c282aa] text-sm">s</span>
      </div>
      
      {/* Progress bar */}
      <div className="flex-grow h-1.5 bg-[#e8c28222] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#e8c282] transition-all duration-1000"
          style={{ width: `${timeLeft.progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default CountdownTimer;
