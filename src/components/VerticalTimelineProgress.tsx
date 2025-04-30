
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
  eventTimes?: Date[]; // New prop for custom time markers
}

const VerticalTimelineProgress = ({ 
  currentTime, 
  events, 
  onEventClick,
  eventTimes 
}: VerticalTimelineProgressProps) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  
  const sortedEvents = [...events].sort((a, b) => a.time.getTime() - b.time.getTime());
  
  // Filter out completed events from timeline display
  const activeEvents = sortedEvents.filter(event => !event.completed);
  
  // Use custom time boundaries if provided, otherwise default to 6am-midnight
  const startOfDay = new Date(currentTime);
  startOfDay.setHours(6, 0, 0, 0);
  
  const endOfDay = new Date(currentTime);
  endOfDay.setHours(23, 59, 59, 999);
  
  // Use provided event times or generate default time markers
  const timelineHours = eventTimes && eventTimes.length > 0 
    ? eventTimes 
    : Array.from({ length: 7 }, (_, i) => {
        const hour = new Date(currentTime);
        hour.setHours(6 + (i * 3), 0, 0, 0);
        return hour;
      });
  
  // Sort time markers
  const sortedTimelineHours = [...timelineHours].sort((a, b) => a.getTime() - b.getTime());
  
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
    return format(date, "h:mma");
  };

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
    
    const event = events.find(e => e.time.getTime() === eventTime.getTime());
    if (!event) return false;
    
    const endTime = getEventEndTime(event);
    if (!endTime) return false;
    
    return currentTime >= eventTime && currentTime <= endTime;
  };
  
  return (
    <TooltipProvider>
      <div className="flex gap-4 mb-8">
        {/* Vertical time bar - elegant and minimal */}
        <div className="relative min-w-16 w-16 flex flex-col justify-between h-[400px] py-2">
          {/* Vertical timeline line - more subtle gradient */}
          <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-[#e8c28215] via-[#e8c28235] to-[#e8c28215]"></div>
          
          {/* Time markers - aligned with events */}
          {sortedTimelineHours.map((hour, index) => (
            <div 
              key={index} 
              className="relative text-[#e8c28288] text-xs flex items-center"
              style={{ 
                position: 'absolute',
                top: `${calculateEventPosition(hour)}%`,
                transform: 'translateY(-50%)'
              }}
            >
              <div className="h-[1px] w-2 bg-[#e8c28222] mr-1"></div>
              {formatHour(hour)}
            </div>
          ))}
          
          {/* Current time indicator - refined design */}
          <div 
            className="absolute left-0 flex items-center z-30 transition-all duration-300"
            style={{ top: `${currentPosition}%` }}
          >
            <div className="bg-[#e8c282] text-[#1a1f2c] px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 shadow-md -translate-y-1/2 transition-all duration-300">
              <Clock size={10} />
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="w-3 h-[1px] bg-[#e8c282]"></div>
          </div>
          
          {/* Event markers - refined design */}
          {activeEvents.map((event, index) => {
            const position = calculateEventPosition(event.time);
            const extractedTime = format(event.time, "h:mm a");
            const approaching = isEventApproaching(event.time);
            const isCurrent = isCurrentEvent(event.time);
            
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      "absolute left-7.5 z-20 cursor-pointer transition-all duration-500",
                      approaching ? "scale-110" : "",
                      isCurrent ? "scale-125" : ""
                    )}
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
                        "flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500",
                        approaching ? "w-5 h-5" : "w-4 h-4",
                        isCurrent ? "animate-glow-3d" : ""
                      )}
                      style={{ 
                        backgroundColor: event.color ? `${event.color}22` : "#e8c28222",
                        border: `1px solid ${event.color || "#e8c282"}`,
                        boxShadow: isCurrent ? `0 0 8px 1px ${event.color || "#e8c282"}30` : "none"
                      }}
                    >
                      {event.icon ? (
                        <span className={cn("transition-all", approaching ? "text-xs" : "text-[10px]")}>{event.icon}</span>
                      ) : (
                        <div 
                          className={cn("rounded-full transition-all", approaching ? "w-1.5 h-1.5" : "w-1 h-1")} 
                          style={{ backgroundColor: event.color || "#e8c282" }}
                        />
                      )}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1a1f2c]/95 border border-[#e8c28220] p-2 max-w-xs backdrop-blur-lg shadow-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-[#edd6ae]">{event.label}</p>
                    <p className="text-sm text-[#e8c282]">{extractedTime}</p>
                    {event.location && (
                      <p className="text-xs text-[#e8c28288]">📍 {event.location}</p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
        
        {/* Events list section - minimal card design with smooth animations */}
        <div className="flex-1 relative">
          <ScrollArea className="h-[400px] pr-4 scrollbar-none">
            <div className="space-y-2">
              {activeEvents.map((event) => {
                // Check if current event
                const isCurrent = events.find(e => 
                  e.id === event.id && 
                  isCurrentEvent(e.time)
                );
                
                return (
                  <div
                    key={`timeline-event-${event.id}`}
                    className={cn(
                      "bg-[#1a1f2c]/60 backdrop-blur-sm border border-[#e8c28215] rounded-lg p-3 cursor-pointer hover:bg-[#1a1f2c]/80 transition-all duration-300 hover:shadow-[0_2px_10px_rgba(232,194,130,0.08)]",
                      isCurrent ? "ring-1 ring-[#e8c282]/20 shadow-[0_0_12px_rgba(232,194,130,0.12)]" : ""
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
                        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                        style={{ backgroundColor: event.color ? `${event.color}18` : "#e8c28218" }}
                      >
                        {event.icon ? (
                          <span className="text-base">{event.icon}</span>
                        ) : (
                          <div 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: event.color || "#e8c282" }}
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <div className="text-[#edd6ae] font-medium truncate">{event.label}</div>
                          <div className="text-xs font-medium text-[#e8c28299] ml-1 whitespace-nowrap">{format(event.time, "h:mm a")}</div>
                        </div>
                        <div className="text-xs text-[#e8c28277] truncate mt-0.5">
                          {event.location && <span>{event.location}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {activeEvents.length === 0 && (
                <div className="text-[#e8c28277] text-center py-8 border border-dashed border-[#e8c28218] rounded-lg transition-all duration-300">
                  No events scheduled
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
      
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="bg-[#1a1f2c]/95 backdrop-blur-lg border border-[#e8c28220] text-[#edd6ae] max-w-md shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
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
              <p className="text-[#e8c28299]">{selectedEvent.description}</p>
            )}
            {selectedEvent?.location && (
              <p className="text-[#e8c28288] flex items-center gap-2">
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
