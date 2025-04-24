
import React, { useState, useEffect } from "react";
import TimeUnit from "./moments/TimeUnit";

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
    const target = targetDate instanceof Date ? targetDate : new Date(targetDate);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = target.getTime() - now.getTime();
      
      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, progress: 100 });
        if (onComplete) onComplete();
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      const totalSeconds = days * 86400 + hours * 3600 + minutes * 60 + seconds;
      const maxTimeInSeconds = 365 * 24 * 60 * 60; // Max 1 year for progress bar
      const progress = 100 - Math.min(100, (totalSeconds / maxTimeInSeconds) * 100);
      
      setTimeLeft({ days, hours, minutes, seconds, progress });
    };
    
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  return (
    <div className="space-y-4">
      <div className="text-[#e8c282] text-sm mb-2 font-medium">Time remaining:</div>
      <div className="flex justify-between w-full gap-8">
        <TimeUnit value={timeLeft.days} unit="days" />
        <TimeUnit value={timeLeft.hours} unit="hours" />
        <TimeUnit value={timeLeft.minutes} unit="minutes" />
        <TimeUnit value={timeLeft.seconds} unit="seconds" />
      </div>
      <div className="h-1.5 bg-[#e8c28222] rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#e8c282] transition-all duration-1000"
          style={{ width: `${timeLeft.progress}%` }}
        />
      </div>
    </div>
  );
};

export default CountdownTimer;
