
import React, { useState } from "react";
import { format } from "date-fns";
import ScheduleItem from "@/components/ScheduleItem";
import { Event, calculateEventProgress } from "@/utils/eventUtils";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

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
  
  // Sort events by time (earliest first)
  const sortedActiveEvents = [...activeEvents].sort((a, b) => 
    new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  // Only show a maximum of 5 events to prevent overcrowding
  const eventsToDisplay = sortedActiveEvents.slice(0, 5);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#e8c282] font-serif text-lg">Upcoming Events</h2>
      </div>
      
      {eventsToDisplay.length === 0 && (
        <div className="text-center text-[#e8c282aa] py-4 border border-dashed border-[#e8c28222] rounded-md">
          No active events for this day
        </div>
      )}
      
      {eventsToDisplay.length > 0 && (
        <div className="relative">
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
            onSelect={(api) => {
              if (api) {
                setActiveIndex(api.selectedScrollSnap());
              }
            }}
          >
            <CarouselContent className="-ml-1">
              {eventsToDisplay.map((event, index) => (
                <CarouselItem 
                  key={`active-event-${event.id}`} 
                  className="basis-full md:basis-full lg:basis-full pl-1"
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
                    isActive={index === activeIndex}
                    onEdit={() => onEventEdit(event)}
                    onDelete={() => onEventDelete(event.id)}
                    onComplete={() => onEventComplete(event.id)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="absolute left-0 bottom-1/2 transform translate-y-1/2 -ml-2 hidden md:block">
              <CarouselPrevious className="bg-[#1a1f2c]/80 border-[#e8c28233] hover:bg-[#2a2f3c] text-[#e8c282] h-8 w-8" />
            </div>
            <div className="absolute right-0 bottom-1/2 transform translate-y-1/2 -mr-2 hidden md:block">
              <CarouselNext className="bg-[#1a1f2c]/80 border-[#e8c28233] hover:bg-[#2a2f3c] text-[#e8c282] h-8 w-8" />
            </div>
            
            <div className="flex items-center justify-center mt-4 gap-1">
              {eventsToDisplay.map((_, index) => (
                <div 
                  key={`indicator-${index}`}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex 
                      ? "bg-[#e8c282] w-4" 
                      : "bg-[#e8c28244]"
                  }`}
                />
              ))}
            </div>
          </Carousel>
        </div>
      )}
      
      {eventsToDisplay.length > 0 && (
        <div className="mt-4 pt-6 pb-1 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 justify-center items-center">
            {eventsToDisplay.map((event, index) => (
              <div 
                key={`dock-event-${event.id}`}
                className={`relative flex-shrink-0 transition-all duration-300 transform
                  ${index === activeIndex 
                    ? "scale-100 opacity-100 z-10" 
                    : index === activeIndex - 1 || index === activeIndex + 1
                      ? "scale-95 opacity-80 z-0"
                      : "scale-90 opacity-60 z-0"
                  }
                `}
                onClick={() => {
                  const carouselApi = document.querySelector('[data-embla-api="true"]');
                  if (carouselApi) {
                    // @ts-ignore - This is a hack to access the Embla API
                    carouselApi.__emblaApi.scrollTo(index);
                  }
                }}
              >
                <div 
                  className={`flex items-center gap-2 px-4 py-2 rounded-full 
                    bg-gradient-to-r from-[#1a1f2c]/90 to-[#11141c]/90
                    border border-[#e8c28233] backdrop-blur-sm
                    ${index === activeIndex 
                      ? "shadow-[0_0_15px_rgba(232,194,130,0.3)]" 
                      : ""
                    }
                  `}
                >
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${event.color}22` }}
                  >
                    {typeof event.icon === 'string' ? (
                      <span className="text-sm">{event.icon}</span>
                    ) : (
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: event.color }}
                      />
                    )}
                  </div>
                  
                  <span className="text-[#e8c282] whitespace-nowrap">
                    {event.title}
                  </span>
                  
                  <span className="text-[#e8c282aa] text-xs">
                    {calculateEventProgress(event, new Date()).timeLeft}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventListSection;
