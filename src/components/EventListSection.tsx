import React, { useState } from "react";
import { format } from "date-fns";
import ScheduleItem from "@/components/ScheduleItem";
import { Event, calculateEventProgress } from "@/utils/eventUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shuffle } from "lucide-react";
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
  // Add state for shuffled events
  const [isShuffled, setIsShuffled] = useState(false);
  
  // Sort events by time (earliest first) for the default view
  const sortedActiveEvents = [...activeEvents].sort((a, b) => 
    new Date(a.time).getTime() - new Date(b.time).getTime()
  );
  
  // Create a shuffled version of the events
  const shuffledActiveEvents = [...activeEvents].sort(() => Math.random() - 0.5);
  
  // Determine which events array to display
  const eventsToDisplay = isShuffled ? shuffledActiveEvents : sortedActiveEvents;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[#e8c282] font-serif text-lg">Upcoming Events</h2>
        <button 
          onClick={() => setIsShuffled(!isShuffled)}
          className="flex items-center gap-1 text-[#e8c282aa] hover:text-[#e8c282] transition-colors p-1.5 rounded-md hover:bg-[#e8c28215]"
          title={isShuffled ? "Sort chronologically" : "Shuffle events"}
        >
          <Shuffle size={16} className={isShuffled ? "text-[#e8c282]" : "text-[#e8c282aa]"} />
          <span className="text-xs font-medium">{isShuffled ? "Shuffled" : "Shuffle"}</span>
        </button>
      </div>
      
      {eventsToDisplay.length === 0 && (
        <div className="text-center text-[#e8c282aa] py-4 border border-dashed border-[#e8c28222] rounded-md">
          No active events for this day
        </div>
      )}
      
      {eventsToDisplay.length > 0 && (
        <div className="relative py-3">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {eventsToDisplay.map((event) => (
                <CarouselItem key={`active-event-${event.id}`} className="md:basis-2/3 lg:basis-1/2">
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
                    onEdit={() => onEventEdit(event)}
                    onDelete={() => onEventDelete(event.id)}
                    onComplete={() => onEventComplete(event.id)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-end mt-2 gap-2">
              <CarouselPrevious className="relative -left-0 bg-[#1a1f2c] border-[#e8c28233] hover:bg-[#2a2f3c] text-[#e8c282]" />
              <CarouselNext className="relative -right-0 bg-[#1a1f2c] border-[#e8c28233] hover:bg-[#2a2f3c] text-[#e8c282]" />
            </div>
          </Carousel>
        </div>
      )}
      
      <div className="hidden">
        <ScrollArea className="max-h-[350px] pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
            {eventsToDisplay.map((event) => (
              <div key={`active-event-list-${event.id}`}>
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
                  onEdit={() => onEventEdit(event)}
                  onDelete={() => onEventDelete(event.id)}
                  onComplete={() => onEventComplete(event.id)}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default EventListSection;
