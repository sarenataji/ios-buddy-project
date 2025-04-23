
import React, { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

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
      className="w-full text-left p-4 bg-[#1a1f2c]/85 border border-[#e8c28244] rounded-lg hover:bg-[#1a1f2c] transition-all duration-300 group
        relative overflow-hidden
        shadow-[0_0_20px_0_#e8c28215]
        hover:shadow-[0_0_30px_0_#e8c28225]
      "
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e8c28205] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      <div className="relative z-10">
        <div className="text-[#e8c282] mb-2 tracking-wide">{title}</div>
        <div className="flex items-baseline space-x-2 text-[#edd6ae]">
          <span className="text-4xl font-bold">{elapsed.days}</span>
          <span className="text-xl">d</span>
          <span className="text-4xl font-bold">{elapsed.hours}</span>
          <span className="text-xl">h</span>
          <span className="text-4xl font-bold">{elapsed.minutes}</span>
          <span className="text-xl">m</span>
          <span className="text-4xl font-bold">{elapsed.seconds}</span>
          <span className="text-xl">s</span>
          <ChevronRight className="ml-auto text-[#e8c28266] group-hover:text-[#e8c282] transition-colors duration-300" />
        </div>
      </div>
    </button>
  );
};

export default ElapsedTimeDisplay;
