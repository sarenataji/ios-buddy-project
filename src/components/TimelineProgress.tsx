
import React from "react";
import { Clock } from "lucide-react";

interface TimelineProgressProps {
  currentTime: Date;
  events: {
    time: Date;
    label: string;
  }[];
}

const TimelineProgress = ({ currentTime, events }: TimelineProgressProps) => {
  // Sort events by time
  const sortedEvents = [...events].sort((a, b) => a.time.getTime() - b.time.getTime());
  
  // Calculate current time position
  const startOfDay = new Date(currentTime);
  startOfDay.setHours(6, 0, 0, 0); // Start timeline at 6 AM
  
  const endOfDay = new Date(currentTime);
  endOfDay.setHours(23, 59, 59, 999); // End timeline at midnight
  
  const totalDayDuration = endOfDay.getTime() - startOfDay.getTime();
  const currentPosition = Math.max(
    0, 
    Math.min(
      100, 
      ((currentTime.getTime() - startOfDay.getTime()) / totalDayDuration) * 100
    )
  );
  
  // Format hour display
  const formatHour = (date: Date) => {
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12
    return `${hours}:00 ${ampm}`;
  };
  
  // Generate timeline hours
  const timelineHours = [];
  for (let i = 6; i <= 23; i += 2) {
    const hourDate = new Date(currentTime);
    hourDate.setHours(i, 0, 0, 0);
    timelineHours.push(hourDate);
  }
  
  return (
    <div className="relative w-full my-4 px-4">
      {/* Current time indicator */}
      <div 
        className="absolute top-0 h-full flex flex-col items-center"
        style={{ left: `${currentPosition}%` }}
      >
        <div className="bg-[#e8c282] text-[#1a1f2c] px-3 py-0.5 rounded-md text-xs font-medium flex items-center gap-1 shadow-md">
          <Clock size={12} />
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="h-full w-0.5 bg-[#e8c282] opacity-70"></div>
      </div>
      
      {/* Timeline hours */}
      <div className="flex justify-between mb-2 pt-8">
        {timelineHours.map((hour, index) => (
          <div key={index} className="text-[#e8c282aa] text-xs flex flex-col items-center">
            <div className="h-1.5 w-0.5 bg-[#e8c28244] mb-1"></div>
            {formatHour(hour)}
          </div>
        ))}
      </div>
      
      {/* Timeline line */}
      <div className="w-full h-0.5 bg-[#e8c28233]"></div>
    </div>
  );
};

export default TimelineProgress;
