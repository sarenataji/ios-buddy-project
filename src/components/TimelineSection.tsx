
import React, { useState } from "react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import VerticalTimelineProgress from "@/components/VerticalTimelineProgress";
import { Event, calculateEventProgress, getEventEndTime } from "@/utils/eventUtils";
import CountdownTimer from "@/components/CountdownTimer";
import { isToday } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface TimelineSectionProps {
  currentTime?: Date;
  currentEvent?: Event | null;
  nextEvent?: Event | null;
  timelineEvents?: Array<{
    id: number;
    time: Date;
    label: string;
    completed?: boolean;
    color?: string;
    icon?: string;
    location?: string;
    description?: string;
  }>;
  onEventSelect?: (id: number) => void;
  // Add new props to match Schedule.tsx usage
  events?: Event[];
  onToggleComplete?: (eventId: number) => void;
}

const TimelineSection = ({
  currentTime = new Date(),
  currentEvent,
  nextEvent,
  timelineEvents = [],
  onEventSelect,
  events = [], // Added to support Schedule.tsx usage
  onToggleComplete, // Added to support Schedule.tsx usage
}: TimelineSectionProps) => {
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  // Use either timelineEvents or transform events prop to match timelineEvents format
  const effectiveTimelineEvents = timelineEvents.length > 0 ? timelineEvents : events.map(event => ({
    id: event.id,
    time: event.time,
    label: event.title,
    completed: event.completed,
    color: event.color,
    icon: event.icon,
    location: event.location,
    description: event.description
  }));

  // Filter active events for timeline
  const activeEvents = effectiveTimelineEvents.filter(event => !event.completed);
  
  // Transform timelineEvents to match Event type for utility functions
  const transformEventForUtils = (event: typeof effectiveTimelineEvents[0]): Event => {
    return {
      id: event.id,
      time: event.time,
      title: event.label,
      description: event.description || "",
      person: "",
      color: event.color || "#e8c282",
      completed: event.completed || false,
      location: event.location,
      icon: event.icon,
      repeat: { enabled: false, days: [] }
    };
  };

  return (
    <div className="space-y-4 animate-fade-in mb-6">
      {/* Current/Next Event Card */}
      <div className="p-5 bg-gradient-to-br from-[#1a1f2c]/95 to-[#1a1f2c]/80 rounded-xl border border-[#e8c28233] shadow-[0_4px_20px_0_#e8c28215] transition-all duration-300 hover:shadow-[0_4px_25px_0_#e8c28220]">
        {currentEvent ? (
          <div className="space-y-3">
            <h3 className="text-[#e8c282] font-medium text-lg flex items-center gap-2">
              <span className="opacity-80">{currentEvent.icon || '▶️'}</span>
              Current: {currentEvent.title}
            </h3>
            <div className="flex items-center gap-2 text-[#e8c28299]">
              <Clock size={16} />
              <span>Ends in:</span>
            </div>
            <CountdownTimer targetDate={getEventEndTime(currentEvent)} />
            {currentEvent.location && (
              <div className="text-[#e8c28280] text-sm mt-1">📍 {currentEvent.location}</div>
            )}
          </div>
        ) : nextEvent ? (
          <div className="space-y-3">
            <h3 className="text-[#e8c282] font-medium text-lg flex items-center gap-2">
              <span className="opacity-80">{nextEvent.icon || '⏱️'}</span>
              Next: {nextEvent.title}
            </h3>
            <div className="flex items-center gap-2 text-[#e8c28299]">
              <Clock size={16} />
              <span>Starts in:</span>
            </div>
            <CountdownTimer targetDate={new Date(nextEvent.time)} />
            {nextEvent.location && (
              <div className="text-[#e8c28280] text-sm mt-1">📍 {nextEvent.location}</div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 py-6 text-[#e8c28288]">
            <Clock size={20} className="opacity-70" />
            <span className="font-light text-lg">No events {isToday(currentTime) ? "today" : "on this day"}</span>
          </div>
        )}
      </div>
      
      {/* Today's Timeline Bar - Horizontal preview showing current position */}
      {activeEvents.length > 0 && (
        <div className="h-3 bg-[#1a1f2c]/60 rounded-full overflow-hidden relative">
          {/* Event markers on the horizontal timeline */}
          {activeEvents.map((event, idx) => {
            // Calculate event position as percentage
            const startTime = event.time;
            const endTime = getEventEndTime(transformEventForUtils(event));
            
            // Create a custom time range that focuses just on the event times
            const earliestEvent = new Date(Math.min(...activeEvents.map(e => e.time.getTime())));
            const latestEndTime = Math.max(...activeEvents.map(e => getEventEndTime(transformEventForUtils(e)).getTime()));
            
            // Calculate position based on event start time relative to the earliest event
            const totalTimeRange = latestEndTime - earliestEvent.getTime();
            const eventPosition = ((startTime.getTime() - earliestEvent.getTime()) / totalTimeRange) * 100;
            
            // Calculate event duration width
            const eventEndPosition = ((endTime.getTime() - earliestEvent.getTime()) / totalTimeRange) * 100;
            const eventWidth = eventEndPosition - eventPosition;
            
            // Determine if this event is current
            const isCurrent = currentEvent && currentEvent.id === event.id;
            
            return (
              <div
                key={`timeline-marker-${idx}`}
                className={`absolute h-full ${isCurrent ? 'bg-[#e8c282]' : 'bg-[#e8c28244]'}`}
                style={{ 
                  left: `${Math.max(0, Math.min(100, eventPosition))}%`,
                  width: `${Math.max(2, Math.min(100, eventWidth))}%`
                }}
              />
            );
          })}
          
          {/* Current time indicator */}
          {activeEvents.length > 0 && (
            <div 
              className="absolute h-full w-1 bg-white/50 z-10 animate-pulse-subtle"
              style={{ 
                left: `${((currentTime.getTime() - Math.min(...activeEvents.map(e => e.time.getTime()))) / 
                      (Math.max(...activeEvents.map(e => getEventEndTime(transformEventForUtils(e)).getTime())) - Math.min(...activeEvents.map(e => e.time.getTime())))) * 100}%`,
                display: activeEvents.length > 0 ? 'block' : 'none'
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default TimelineSection;
