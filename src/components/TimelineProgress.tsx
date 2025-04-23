
import React, { useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";

interface TimelineEvent {
  id?: number;
  time: Date;
  label: string;
  completed?: boolean;
  color?: string;
  icon?: string;
  location?: string;
  description?: string;
}

interface TimelineProgressProps {
  currentTime: Date;
  events: TimelineEvent[];
  onEventClick?: (eventId: number) => void;
}

const TimelineProgress = ({ currentTime, events, onEventClick }: TimelineProgressProps) => {
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
  
  // Calculate event positions on timeline
  const calculateEventPosition = (time: Date) => {
    return Math.max(
      0,
      Math.min(
        100,
        ((time.getTime() - startOfDay.getTime()) / totalDayDuration) * 100
      )
    );
  };
  
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

  // Check if event is approaching (within 30 minutes)
  const isEventApproaching = (eventTime: Date) => {
    const timeDiff = eventTime.getTime() - currentTime.getTime();
    return timeDiff > 0 && timeDiff < 30 * 60 * 1000; // 30 minutes in milliseconds
  };
  
  return (
    <TooltipProvider>
      <div className="relative w-full my-4 px-4">
        {/* Current time indicator */}
        <div 
          className="absolute top-0 h-full flex flex-col items-center z-20"
          style={{ left: `${currentPosition}%` }}
        >
          <div className="bg-[#e8c282] text-[#1a1f2c] px-3 py-0.5 rounded-md text-xs font-medium flex items-center gap-1 shadow-md">
            <Clock size={12} />
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="h-full w-0.5 bg-[#e8c282] opacity-70"></div>
        </div>
        
        {/* Event markers on timeline */}
        {sortedEvents.map((event, index) => {
          const position = calculateEventPosition(event.time);
          const extractedTime = format(event.time, "h:mm a");
          const description = event.description || "";
          const approaching = isEventApproaching(event.time);
          
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <div
                  className="absolute z-10 cursor-pointer"
                  style={{ left: `${position}%`, top: "8px" }}
                  onClick={() => event.id && onEventClick && onEventClick(event.id)}
                >
                  <div 
                    className={cn(
                      "flex items-center justify-center transform -translate-x-1/2 rounded-full transition-all duration-300",
                      event.completed ? "opacity-50" : "opacity-90",
                      approaching ? "w-8 h-8" : "w-6 h-6"
                    )}
                    style={{ 
                      backgroundColor: event.color ? `${event.color}33` : "#e8c28233",
                      border: `2px solid ${event.color || "#e8c282"}`
                    }}
                  >
                    {event.icon ? (
                      <span className={cn("transition-all", approaching ? "text-xs" : "text-[10px]")}>{event.icon}</span>
                    ) : (
                      <div 
                        className={cn("rounded-full transition-all", approaching ? "w-3 h-3" : "w-2 h-2")} 
                        style={{ backgroundColor: event.color || "#e8c282" }}
                      />
                    )}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-[#1a1f2c] border border-[#e8c28233] p-3 max-w-xs">
                <div className="space-y-1">
                  <p className="font-medium text-[#edd6ae]">{event.label}</p>
                  <p className="text-sm text-[#e8c282]">{extractedTime} {description}</p>
                  {event.location && (
                    <p className="text-sm text-[#e8c282aa]">📍 {event.location}</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
        
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
    </TooltipProvider>
  );
};

export default TimelineProgress;
