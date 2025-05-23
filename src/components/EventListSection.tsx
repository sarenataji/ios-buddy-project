import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import ScheduleItem from "@/components/ScheduleItem";
import { Event, calculateEventProgress } from "@/utils/eventUtils";
import { 
  Shuffle,
  ChevronUp,
  ChevronDown,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface EventListSectionProps {
  activeEvents?: Event[];
  onEventEdit?: (event: Event) => void;
  onEventDelete?: (id: number) => void;
  onEventComplete?: (id: number) => void;
  currentEvent?: Event | null;
  // New props to match Schedule.tsx usage
  events?: Event[];
  onToggleComplete?: (eventId: number) => void;
  onEditEvent?: (event: any) => void;
  onDeleteEvent?: (event: any) => void;
}

const EventListSection = ({
  activeEvents,
  onEventEdit,
  onEventDelete,
  onEventComplete,
  currentEvent,
  // New props to match Schedule.tsx usage
  events = [],
  onToggleComplete,
  onEditEvent,
  onDeleteEvent
}: EventListSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [shuffleEffect, setShuffleEffect] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'none' | 'up' | 'down'>('none');
  
  // Use either activeEvents or events based on which is provided
  const effectiveEvents = activeEvents?.length ? activeEvents : events;
  
  // Sort events by time (earliest first)
  const sortedActiveEvents = [...effectiveEvents].sort((a, b) => 
    new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  // Only show a maximum of 5 events to prevent overcrowding
  const eventsToDisplay = sortedActiveEvents.slice(0, 5);
  
  // Set current time for time bar sync
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Get current time percentage for vertical time bar
  const getTimePercentage = () => {
    const now = currentTime;
    const startOfDay = new Date(now);
    startOfDay.setHours(6, 0, 0, 0);
    
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    
    const totalDayDuration = endOfDay.getTime() - startOfDay.getTime();
    return Math.max(
      0, 
      Math.min(
        100, 
        ((now.getTime() - startOfDay.getTime()) / totalDayDuration) * 100
      )
    );
  };
  
  const handleShuffle = () => {
    setShuffleEffect(true);
    setTimeout(() => {
      setShuffleEffect(false);
    }, 800);
  };

  const handlePrevious = () => {
    if (activeIndex > 0) {
      setSlideDirection('down');
      setTimeout(() => {
        setActiveIndex(activeIndex - 1);
        setSlideDirection('none');
      }, 300);
    } else {
      setSlideDirection('down');
      setTimeout(() => {
        setActiveIndex(eventsToDisplay.length - 1);
        setSlideDirection('none');
      }, 300);
    }
  };
  
  const handleNext = () => {
    if (activeIndex < eventsToDisplay.length - 1) {
      setSlideDirection('up');
      setTimeout(() => {
        setActiveIndex(activeIndex + 1);
        setSlideDirection('none');
      }, 300);
    } else {
      setSlideDirection('up');
      setTimeout(() => {
        setActiveIndex(0);
        setSlideDirection('none');
      }, 300);
    }
  };

  // Handle event actions based on which props are provided
  const handleEditEvent = (event: Event) => {
    if (onEditEvent) {
      onEditEvent(event);
    } else if (onEventEdit) {
      onEventEdit(event);
    }
  };

  const handleDeleteEvent = (id: number) => {
    if (onDeleteEvent) {
      onDeleteEvent({id}); // Pass as object for backward compatibility
    } else if (onEventDelete) {
      onEventDelete(id);
    }
  };

  const handleCompleteEvent = (id: number) => {
    if (onToggleComplete) {
      onToggleComplete(id);
    } else if (onEventComplete) {
      onEventComplete(id);
    }
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

  return (
    <div className="space-y-3 mt-2">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-[#c69c6d] font-serif text-lg">Upcoming Events</h2>
          {eventsToDisplay.length === 0 ? (
            <span className="text-xs text-[#c69c6d88]">No events</span>
          ) : (
            <span className="text-xs text-[#c69c6d]">{eventsToDisplay.length} event{eventsToDisplay.length !== 1 && 's'}</span>
          )}
        </div>
        
        <Button
          onClick={handleShuffle}
          variant="ghost"
          className="text-[#c69c6d] hover:bg-[#c69c6d22] p-1 h-8 w-8"
          aria-label="Shuffle events"
        >
          <Shuffle className="h-5 w-5" />
        </Button>
      </div>
      
      {eventsToDisplay.length === 0 && (
        <div className="text-center text-[#c69c6daa] py-4 border border-dashed border-[#c69c6d22] rounded-md">
          No active events for this day
        </div>
      )}
      
      {eventsToDisplay.length > 0 && (
        <div className="flex gap-6">
          {/* Time bar on left side */}
          <div className="relative min-w-[60px] w-[60px] flex flex-col justify-between h-[300px]">
            {/* Vertical timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-[#c69c6d33]"></div>
            
            {/* Current time indicator */}
            <div 
              className="absolute left-0 flex items-center z-30"
              style={{ top: `${getTimePercentage()}%` }}
            >
              <div className="bg-[#c69c6d] text-[#2a1f15] px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1 shadow-md -translate-y-1/2">
                <Clock size={10} />
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="w-5 h-0.5 bg-[#c69c6d] opacity-70"></div>
            </div>
            
            {/* Time markers */}
            {timelineHours.map((hour, index) => (
              <div 
                key={index} 
                className="absolute left-0 text-[#c69c6daa] text-xs flex items-center"
                style={{ top: `${(index / (timelineHours.length - 1)) * 100}%` }}
              >
                <div className="h-0.5 w-1.5 bg-[#c69c6d44] mr-1"></div>
                {formatHour(hour)}
              </div>
            ))}
          </div>
          
          {/* Main deck area */}
          <div className="flex-1 relative perspective-1000">
            <div className={`relative ${shuffleEffect ? 'animate-shuffle' : ''}`}>
              {eventsToDisplay.map((event, index) => (
                <div 
                  key={`active-event-${event.id}`} 
                  className={`transition-all duration-300 absolute w-full
                    ${index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"}
                    ${slideDirection === 'up' && index === activeIndex ? 'animate-slide-up' : ''}
                    ${slideDirection === 'down' && index === activeIndex ? 'animate-slide-down' : ''}
                  `}
                >
                  <ScheduleItem 
                    time={format(new Date(event.time), "h:mm a")}
                    title={event.title}
                    description={event.description}
                    person={event.person}
                    color={event.color}
                    icon={event.icon}
                    progress={calculateEventProgress(event, new Date()).progress}
                    timeLeft={calculateEventProgress(event, new Date()).timeLeft}
                    location={event.location}
                    isCurrent={currentEvent?.id === event.id}
                    isActive={true}
                    onEdit={() => handleEditEvent(event)}
                    onDelete={() => handleDeleteEvent(event.id)}
                    onComplete={() => handleCompleteEvent(event.id)}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-8 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                className="bg-[#2a1f15]/80 border-[#c69c6d33] hover:bg-[#3a2f25] text-[#c69c6d] h-8 w-8 p-0 rounded-full"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center justify-center gap-1">
                {eventsToDisplay.map((_, index) => (
                  <div 
                    key={`indicator-${index}`}
                    className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      index === activeIndex 
                        ? "bg-[#c69c6d] w-4" 
                        : "bg-[#c69c6d44]"
                    }`}
                    onClick={() => setActiveIndex(index)}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                className="bg-[#2a1f15]/80 border-[#c69c6d33] hover:bg-[#3a2f25] text-[#c69c6d] h-8 w-8 p-0 rounded-full"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventListSection;
