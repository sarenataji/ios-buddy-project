import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface ElapsedTimeDisplayProps {
  title: string;
  startDate: Date;
  onClick?: () => void;
}

const ElapsedTimeDisplay: React.FC<ElapsedTimeDisplayProps> = ({ title, startDate, onClick }) => {
  const [elapsed, setElapsed] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateElapsed = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setElapsed({ days, hours, minutes, seconds });
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <button 
      onClick={onClick}
      className="w-full text-left p-6 bg-[#1a1f2c]/85 border border-[#e8c28244] rounded-lg 
        hover:bg-[#1a1f2c] transition-all duration-300 group relative overflow-hidden
        shadow-[0_0_20px_0_#e8c28215] hover:shadow-[0_0_30px_0_#e8c28225]"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e8c28205] to-transparent 
        translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-[#e8c282] w-5 h-5" />
          <span className="text-[#e8c282] tracking-wide">{title}</span>
        </div>
        
        <div className="inline-flex items-baseline gap-3 text-[#edd6ae]">
          <TimeUnit value={elapsed.days} unit="d" />
          <TimeUnit value={elapsed.hours} unit="h" />
          <TimeUnit value={elapsed.minutes} unit="m" />
          <TimeUnit value={elapsed.seconds} unit="s" />
        </div>
      </div>
    </button>
  );
};

const TimeUnit = ({ value, unit }: { value: number; unit: string }) => (
  <div className="flex items-baseline gap-1">
    <span className="text-3xl font-bold font-mono tracking-tight">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-sm uppercase tracking-wider text-[#e8c28288]">
      {unit}
    </span>
  </div>
);

export default ElapsedTimeDisplay;
