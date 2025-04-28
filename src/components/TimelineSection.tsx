
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
    <>
      <div className="mb-6 p-4 bg-[#1a1f2c]/80 rounded-lg border border-[#e8c28233] shadow-[0_4px_15px_0_#e8c28215]">
        {currentEvent ? (
          <>
            <div className="text-[#e8c282] text-sm mb-2">
              <span className="font-medium">Current Event:</span> {currentEvent.title}
            </div>
            <CountdownTimer targetDate={getEventEndTime(currentEvent)} />
          </>
        ) : nextEvent ? (
          <>
            <div className="text-[#e8c282] text-sm mb-2">
              <span className="font-medium">Next Event:</span> {nextEvent.title}
            </div>
            <CountdownTimer targetDate={new Date(nextEvent.time)} />
          </>
        ) : (
          <div className="text-[#e8c282] text-center py-2">No upcoming events {isToday(currentTime) ? "today" : "on this day"}</div>
        )}
      </div>
      
      <VerticalTimelineProgress 
        currentTime={currentTime}
        events={timelineEvents}
        onEventClick={onEventSelect}
      />
    </>
  );
};

export default TimelineSection;
