
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
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface VerticalTimelineProgressProps {
  currentTime: Date;
  events: TimelineEvent[];
  onEventClick?: (eventId: number) => void;
}

const VerticalTimelineProgress = ({ currentTime, events, onEventClick }: VerticalTimelineProgressProps) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  
  const sortedEvents = [...events].sort((a, b) => a.time.getTime() - b.time.getTime());
  
  // Filter out completed events from timeline display
  const activeEvents = sortedEvents.filter(event => !event.completed);
  
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
    return `${hours}${ampm}`;
  };
  
  const timelineHours = [];
  for (let i = 6; i <= 23; i += 3) {
    const hourDate = new Date(currentTime);
    hourDate.setHours(i, 0, 0, 0);
    timelineHours.push(hourDate);
  }

  const isEventApproaching = (eventTime: Date) => {
    const timeDiff = eventTime.getTime() - currentTime.getTime();
    return timeDiff > 0 && timeDiff < 30 * 60 * 1000;
  };
  
  const isCurrentEvent = (eventTime: Date) => {
    // Parse event description to get end time
    const getEventEndTime = (event: TimelineEvent) => {
      if (!event.description) return null;
      
      const parts = event.description.split(" - ");
      if (parts.length < 2) return null;
      
      const endTimePart = parts[1];
      const [hours, minutesWithAmPm] = endTimePart.split(":");
      if (!hours || !minutesWithAmPm) return null;
      
      const minutes = minutesWithAmPm.substring(0, 2);
      const ampm = minutesWithAmPm.substring(2).trim();
      
      let hourNum = parseInt(hours);
      const minuteNum = parseInt(minutes);
      
      if (ampm.toLowerCase() === "pm" && hourNum < 12) hourNum += 12;
      if (ampm.toLowerCase() === "am" && hourNum === 12) hourNum = 0;
      
      const endTime = new Date(currentTime);
      endTime.setHours(hourNum, minuteNum, 0, 0);
      
      return endTime;
    };
    
    const event = events.find(e => e.time === eventTime);
    if (!event) return false;
    
    const endTime = getEventEndTime(event);
    if (!endTime) return false;
    
    return currentTime >= eventTime && currentTime <= endTime;
  };
  
  return (
    <TooltipProvider>
      <div className="flex gap-4 mb-8">
        {/* Vertical time bar - simplified and cleaner */}
        <div className="relative min-w-10 w-10 flex flex-col justify-between h-[400px] py-2">
          {/* Vertical timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#e8c28222] via-[#e8c28244] to-[#e8c28222]"></div>
          
          {/* Time markers with cleaner format */}
          {timelineHours.map((hour, index) => (
            <div 
              key={index} 
              className="relative text-[#e8c282aa] text-xs flex items-center"
              style={{ top: `${(index / (timelineHours.length - 1)) * 100}%` }}
            >
              <div className="h-[1px] w-2 bg-[#e8c28233] mr-1"></div>
              {formatHour(hour)}
            </div>
          ))}
          
          {/* Current time indicator - cleaner design */}
          <div 
            className="absolute left-0 flex items-center z-30"
            style={{ top: `${currentPosition}%` }}
          >
            <div className="bg-[#e8c282] text-[#1a1f2c] px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 shadow-lg -translate-y-1/2">
              <Clock size={10} />
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="w-3 h-[2px] bg-[#e8c282]"></div>
          </div>
          
          {/* Event markers with cleaner positioning */}
          {activeEvents.map((event, index) => {
            const position = calculateEventPosition(event.time);
            const extractedTime = format(event.time, "h:mm a");
            const approaching = isEventApproaching(event.time);
            const isCurrent = isCurrentEvent(event.time);
            
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div
                    className="absolute left-3.5 z-20 cursor-pointer"
                    style={{ top: `${position}%` }}
                    onClick={() => {
                      if (event.id && onEventClick) {
                        onEventClick(event.id);
                      } else {
                        setSelectedEvent(event);
                      }
                    }}
                  >
                    <div 
                      className={cn(
                        "flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300",
                        approaching ? "w-6 h-6 animate-pulse-subtle" : "w-5 h-5",
                        isCurrent ? "animate-glow-3d" : ""
                      )}
                      style={{ 
                        backgroundColor: event.color ? `${event.color}33` : "#e8c28233",
                        border: `2px solid ${event.color || "#e8c282"}`,
                        boxShadow: isCurrent ? `0 0 10px 2px ${event.color || "#8B5CF6"}30` : "none"
                      }}
                    >
                      {event.icon ? (
                        <span className={cn("transition-all", approaching ? "text-xs" : "text-[10px]")}>{event.icon}</span>
                      ) : (
                        <div 
                          className={cn("rounded-full transition-all", approaching ? "w-2 h-2" : "w-1.5 h-1.5")} 
                          style={{ backgroundColor: event.color || "#e8c282" }}
                        />
                      )}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1a1f2c] border border-[#e8c28233] p-2.5 max-w-xs">
                  <div className="space-y-1">
                    <p className="font-medium text-[#edd6ae]">{event.label}</p>
                    <p className="text-sm text-[#e8c282]">{extractedTime}</p>
                    {event.location && (
                      <p className="text-xs text-[#e8c282aa]">📍 {event.location}</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
        
        {/* Events list section - cleaner card design */}
        <div className="flex-1 relative">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2.5">
              {activeEvents.map((event) => (
                <div
                  key={`timeline-event-${event.id}`}
                  className={cn(
                    "bg-[#1a1f2c]/70 border border-[#e8c28215] rounded-xl p-3.5 cursor-pointer hover:bg-[#1a1f2c]/90 transition-colors",
                    isCurrentEvent(event.time) ? "ring-1 ring-[#e8c282]/30 shadow-[0_0_15px_rgba(232,194,130,0.15)]" : ""
                  )}
                  onClick={() => {
                    if (event.id && onEventClick) {
                      onEventClick(event.id);
                    } else {
                      setSelectedEvent(event);
                    }
                  }}
                >
                  <div className="flex gap-3 items-center">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: event.color ? `${event.color}22` : "#e8c28222" }}
                    >
                      {event.icon ? (
                        <span className="text-lg">{event.icon}</span>
                      ) : (
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: event.color || "#e8c282" }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className="text-[#edd6ae] font-medium">{event.label}</div>
                        <div className="text-xs font-medium text-[#e8c282]">{format(event.time, "h:mm a")}</div>
                      </div>
                      <div className="text-xs text-[#e8c282aa] flex flex-wrap gap-1.5 items-center mt-0.5">
                        {event.location && <span>{event.location}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {activeEvents.length === 0 && (
                <div className="text-[#e8c282aa] text-center py-8 border border-dashed border-[#e8c28222] rounded-xl">
                  No events scheduled
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
      
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
    </TooltipProvider>
  );
};

export default VerticalTimelineProgress;
