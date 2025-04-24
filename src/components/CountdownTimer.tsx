
import React, { useState, useEffect } from "react";

interface CountdownTimerProps {
  targetDate: Date;
  onComplete?: () => void;
}

const CountdownTimer = ({ targetDate, onComplete }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    progress: 0,
  });

  useEffect(() => {
    // Ensure targetDate is treated as a Date object
    const target = targetDate instanceof Date ? targetDate : new Date(targetDate);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();
      
      if (difference <= 0) {
        // Target date has passed
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, progress: 100 });
        if (onComplete) onComplete();
        return;
      }
      
      // Calculate days, hours, minutes, seconds
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      // Calculate progress - assuming the countdown was set with a specific duration
      // Here we're using a simpler approach based on remaining time
      const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
      const maxTimeInSeconds = 365 * 24 * 60 * 60; // Max 1 year for progress bar
      const progress = 100 - Math.min(100, (totalSeconds / maxTimeInSeconds) * 100);
      
      setTimeLeft({ days, hours, minutes, seconds, progress });
    };
    
    calculateTimeLeft(); // Calculate immediately on mount
    const interval = setInterval(calculateTimeLeft, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);
  
  // Format time units to always have two digits
  const formatTimeUnit = (unit: number) => unit.toString().padStart(2, "0");
  
  return (
    <div className="flex items-center w-full gap-4">
      <div className="font-mono text-xl text-[#edd6ae] tracking-wider flex items-baseline gap-1">
        {timeLeft.days > 0 && (
          <>
            <span className="text-[#edd6ae] font-medium">{timeLeft.days}</span>
            <span className="text-[#e8c282aa] text-sm">d</span>
          </>
        )}
        <span className="text-[#edd6ae] font-medium">{formatTimeUnit(timeLeft.hours)}</span>
        <span className="text-[#e8c282aa] text-sm">h</span>
        <span className="text-[#edd6ae] font-medium">{formatTimeUnit(timeLeft.minutes)}</span>
        <span className="text-[#e8c282aa] text-sm">m</span>
        <span className="text-[#edd6ae] font-medium">{formatTimeUnit(timeLeft.seconds)}</span>
        <span className="text-[#e8c282aa] text-sm">s</span>
      </div>
      
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
