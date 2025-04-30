
import React, { useState } from "react";
import { Clock, ChevronDown, ChevronUp } from "lucide-react";
import VerticalTimelineProgress from "@/components/VerticalTimelineProgress";
import { Event, calculateEventProgress, getEventEndTime } from "@/utils/eventUtils";
import CountdownTimer from "@/components/CountdownTimer";
import { isToday } from "date-fns";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

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
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Current/Next Event Card - Enhanced with more prominent design */}
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
      
      {/* Timeline Dropdown Component */}
      <Collapsible 
        open={isTimelineOpen} 
        onOpenChange={setIsTimelineOpen} 
        className="border border-[#e8c28222] rounded-xl overflow-hidden transition-all duration-300 bg-[#1a1f2c]/60"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-4 text-[#e8c282] hover:bg-[#e8c28215] transition-all duration-200"
          >
            <span className="font-medium flex items-center gap-2">
              <Clock size={16} className="opacity-70" />
              Today's Timeline 
            </span>
            {isTimelineOpen ? (
              <ChevronUp className="h-5 w-5 opacity-70 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-5 w-5 opacity-70 transition-transform duration-200" />
            )}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="px-3 pb-3">
          <div className={`transform transition-all duration-500 ease-in-out ${isTimelineOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <VerticalTimelineProgress 
              currentTime={currentTime}
              events={timelineEvents}
              onEventClick={onEventSelect}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TimelineSection;
