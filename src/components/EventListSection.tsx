
import React from "react";
import { format } from "date-fns";
import ScheduleItem from "@/components/ScheduleItem";
import { Event, calculateEventProgress } from "@/utils/eventUtils";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  // Sort events by time (earliest first)
  const sortedActiveEvents = [...activeEvents].sort((a, b) => 
    new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  return (
    <div className="space-y-3">
      <h2 className="text-[#e8c282] font-serif text-lg mb-2">Upcoming Events</h2>
      
      {sortedActiveEvents.length === 0 && (
        <div className="text-center text-[#e8c282aa] py-4 border border-dashed border-[#e8c28222] rounded-md">
          No active events for this day
        </div>
      )}
      
      <ScrollArea className="max-h-[350px] pr-2">
        <div className="space-y-3 pb-2">
          {sortedActiveEvents.map((event) => (
            <div key={`active-event-${event.id}`}>
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
  );
};

export default EventListSection;
