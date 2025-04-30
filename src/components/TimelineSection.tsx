
import React from "react";
import { Clock } from "lucide-react";
import VerticalTimelineProgress from "@/components/VerticalTimelineProgress";
import { Event, calculateEventProgress, getEventEndTime } from "@/utils/eventUtils";
import CountdownTimer from "@/components/CountdownTimer";
import { isToday } from "date-fns";

interface TimelineSectionProps {
  currentTime: Date;
  currentEvent: Event | null;
  nextEvent: Event | null;
  timelineEvents: Array<{
    id: number;
    time: Date;
    label: string;
    completed?: boolean;
    color?: string;
    icon?: string;
    location?: string;
    description?: string;
  }>;
  onEventSelect: (id: number) => void;
}

const TimelineSection = ({
  currentTime,
  currentEvent,
  nextEvent,
  timelineEvents,
  onEventSelect
}: TimelineSectionProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Current/Next Event Card - Refined minimal design */}
      <div className="p-4 bg-gradient-to-br from-[#1a1f2c]/90 to-[#1a1f2c]/70 rounded-xl border border-[#e8c28222] shadow-[0_4px_20px_0_#e8c28210] transition-all duration-300 hover:shadow-[0_4px_25px_0_#e8c28218]">
        {currentEvent ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[#e8c282] opacity-70">{currentEvent.icon || '▶️'}</span>
              <h3 className="text-[#e8c282] font-medium">{currentEvent.title}</h3>
            </div>
            <CountdownTimer targetDate={getEventEndTime(currentEvent)} />
          </div>
        ) : nextEvent ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[#e8c282] opacity-70">{nextEvent.icon || '⏱️'}</span>
              <h3 className="text-[#e8c282] font-medium">Next: {nextEvent.title}</h3>
            </div>
            <CountdownTimer targetDate={new Date(nextEvent.time)} />
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 py-3 text-[#e8c282] opacity-80">
            <Clock size={16} className="opacity-60" />
            <span className="font-light">No events {isToday(currentTime) ? "today" : "on this day"}</span>
          </div>
        )}
      </div>
      
      {/* Timeline Component - Now more prominent */}
      <div className="transform transition-all duration-500 ease-in-out">
        <VerticalTimelineProgress 
          currentTime={currentTime}
          events={timelineEvents}
          onEventClick={onEventSelect}
        />
      </div>
    </div>
  );
};

export default TimelineSection;
