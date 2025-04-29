
import React, { useState } from "react";
import { format } from "date-fns";
import ScheduleItem from "@/components/ScheduleItem";
import { Event, calculateEventProgress } from "@/utils/eventUtils";
import { 
  Shuffle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventListSectionProps {
  activeEvents: Event[];
  onEventEdit: (event: Event) => void;
  onEventDelete: (id: number) => void;
  onEventComplete: (id: number) => void;
  currentEvent: Event | null;
}

const EventListSection = ({
  activeEvents,
  onEventEdit,
  onEventDelete,
  onEventComplete,
  currentEvent
}: EventListSectionProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [shuffleEffect, setShuffleEffect] = useState(false);
  
  // Sort events by time (earliest first)
  const sortedActiveEvents = [...activeEvents].sort((a, b) => 
    new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  // Only show a maximum of 5 events to prevent overcrowding
  const eventsToDisplay = sortedActiveEvents.slice(0, 5);
  
  const handleShuffle = () => {
    setShuffleEffect(true);
    setTimeout(() => {
      setShuffleEffect(false);
    }, 800);
  };

  const handlePrevious = () => {
    setActiveIndex((prevIndex) => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      }
      return eventsToDisplay.length - 1;
    });
  };
  
  const handleNext = () => {
    setActiveIndex((prevIndex) => {
      if (prevIndex < eventsToDisplay.length - 1) {
        return prevIndex + 1;
      }
      return 0;
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#e8c282] font-serif text-lg">Upcoming Events</h2>
        
        <Button
          onClick={handleShuffle}
          variant="ghost"
          className="text-[#e8c282] hover:bg-[#e8c28222] p-1 h-8 w-8"
          aria-label="Shuffle events"
        >
          <Shuffle className="h-5 w-5" />
        </Button>
      </div>
      
      {eventsToDisplay.length === 0 && (
        <div className="text-center text-[#e8c282aa] py-4 border border-dashed border-[#e8c28222] rounded-md">
          No active events for this day
        </div>
      )}
      
      {eventsToDisplay.length > 0 && (
        <div className="relative perspective-1000">
          <div className={`relative ${shuffleEffect ? 'animate-shuffle' : ''}`}>
            {eventsToDisplay.map((event, index) => (
              <div 
                key={`active-event-${event.id}`} 
                className={`transition-all duration-300 absolute w-full
                  ${index === activeIndex 
                    ? "opacity-100 z-10 translate-y-0 rotate-0" 
                    : index === (activeIndex + 1) % eventsToDisplay.length
                      ? "opacity-0 z-0 translate-y-4 rotate-2" 
                      : index === (activeIndex + 2) % eventsToDisplay.length
                        ? "opacity-0 z-0 translate-y-8 rotate-4"
                        : "opacity-0 z-0 -translate-y-4 -rotate-2"
                  }
                `}
                style={{
                  transform: `
                    translateY(${index === activeIndex ? '0px' : index === (activeIndex + 1) % eventsToDisplay.length ? '4px' : '8px'}) 
                    rotate(${index === activeIndex ? '0deg' : index === (activeIndex + 1) % eventsToDisplay.length ? '2deg' : '-2deg'})
                  `,
                  display: index >= activeIndex && index < activeIndex + 3 || (activeIndex + index) % eventsToDisplay.length < 3 ? 'block' : 'none'
                }}
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
                  onEdit={() => onEventEdit(event)}
                  onDelete={() => onEventDelete(event.id)}
                  onComplete={() => onEventComplete(event.id)}
                />
              </div>
            ))}
          </div>
          
          <div className="flex justify-center items-center mt-8 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              className="bg-[#1a1f2c]/80 border-[#e8c28233] hover:bg-[#2a2f3c] text-[#e8c282] h-8 w-8 p-0 rounded-full"
            >
              ←
            </Button>
            
            <div className="flex items-center justify-center mt-2 gap-1">
              {eventsToDisplay.map((_, index) => (
                <div 
                  key={`indicator-${index}`}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    index === activeIndex 
                      ? "bg-[#e8c282] w-4" 
                      : "bg-[#e8c28244]"
                  }`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              className="bg-[#1a1f2c]/80 border-[#e8c28233] hover:bg-[#2a2f3c] text-[#e8c282] h-8 w-8 p-0 rounded-full"
            >
              →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventListSection;
