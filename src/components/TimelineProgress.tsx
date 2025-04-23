import React, { useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  
  const sortedEvents = [...events].sort((a, b) => a.time.getTime() - b.time.getTime());
  
  const startOfDay = new Date(currentTime);
  startOfDay.setHours(6, 0, 0, 0);
  
  const endOfDay = new Date(currentTime);
  endOfDay.setHours(23, 59, 59, 999);
  
  const totalDayDuration = endOfDay.getTime() - startOfDay.getTime();
  const currentPosition = Math.max(
    0, 
    Math.min(
      100, 
      ((currentTime.getTime() - startOfDay.getTime()) / totalDayDuration) * 100
    )
  );
  
  const calculateEventPosition = (time: Date) => {
    return Math.max(
      0,
      Math.min(
        100,
        ((time.getTime() - startOfDay.getTime()) / totalDayDuration) * 100
      )
    );
  };
  
  const formatHour = (date: Date) => {
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:00 ${ampm}`;
  };
  
  const timelineHours = [];
  for (let i = 6; i <= 23; i += 2) {
    const hourDate = new Date(currentTime);
    hourDate.setHours(i, 0, 0, 0);
    timelineHours.push(hourDate);
  }

  const isEventApproaching = (eventTime: Date) => {
    const timeDiff = eventTime.getTime() - currentTime.getTime();
    return timeDiff > 0 && timeDiff < 30 * 60 * 1000;
  };
  
  return (
    <TooltipProvider>
      <div className="relative w-full my-4 px-4">
        <div 
          className="absolute top-0 h-full flex flex-col items-center z-30"
          style={{ left: `${currentPosition}%` }}
        >
          <div className="bg-[#e8c282] text-[#1a1f2c] px-3 py-0.5 rounded-md text-xs font-medium flex items-center gap-1 shadow-md">
            <Clock size={12} />
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="h-full w-0.5 bg-[#e8c282] opacity-70"></div>
        </div>
        
        {sortedEvents.filter(event => !event.completed).map((event, index) => {
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
                  onClick={() => setSelectedEvent(event)}
                >
                  <div 
                    className={cn(
                      "flex items-center justify-center transform -translate-x-1/2 rounded-full transition-all duration-300",
                      approaching ? "w-7 h-7 animate-pulse-subtle" : "w-5 h-5"
                    )}
                    style={{ 
                      backgroundColor: event.color ? `${event.color}33` : "#e8c28233",
                      border: `2px solid ${event.color || "#e8c282"}`
                    }}
                  >
                    {event.icon ? (
                      <span className={cn("transition-all", approaching ? "text-xs" : "text-[9px]")}>{event.icon}</span>
                    ) : (
                      <div 
                        className={cn("rounded-full transition-all", approaching ? "w-2.5 h-2.5" : "w-1.5 h-1.5")} 
                        style={{ backgroundColor: event.color || "#e8c282" }}
                      />
                    )}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-[#1a1f2c] border border-[#e8c28233] p-3 max-w-xs">
                <div className="space-y-1">
                  <p className="font-medium text-[#edd6ae]">{event.label}</p>
                  <p className="text-sm text-[#e8c282]">{extractedTime} {event.description}</p>
                  {event.location && (
                    <p className="text-sm text-[#e8c282aa]">📍 {event.location}</p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
        
        <div className="flex justify-between mb-2 pt-8">
          {timelineHours.map((hour, index) => (
            <div key={index} className="text-[#e8c282aa] text-xs flex flex-col items-center">
              <div className="h-1.5 w-0.5 bg-[#e8c28244] mb-1"></div>
              {formatHour(hour)}
            </div>
          ))}
        </div>
        
        <div className="w-full h-0.5 bg-[#e8c28233]"></div>
        
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="bg-[#1a1f2c] border border-[#e8c28233] text-[#edd6ae] max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#edd6ae] flex items-center gap-2">
                {selectedEvent?.icon && <span>{selectedEvent.icon}</span>}
                {selectedEvent?.label}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-[#e8c282] flex items-center gap-2">
                <Clock size={16} />
                {selectedEvent?.time && format(selectedEvent.time, "h:mm a")}
              </div>
              {selectedEvent?.description && (
                <p className="text-[#e8c282cc]">{selectedEvent.description}</p>
              )}
              {selectedEvent?.location && (
                <p className="text-[#e8c282aa] flex items-center gap-2">
                  📍 {selectedEvent.location}
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};

export default TimelineProgress;
