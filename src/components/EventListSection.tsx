
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ScheduleItem from "@/components/ScheduleItem";
import { Event, calculateEventProgress } from "@/utils/eventUtils";

interface EventListSectionProps {
  activeEvents: Event[];
  completedEvents: Event[];
  onEventEdit: (event: Event) => void;
  onEventDelete: (id: number) => void;
  onEventComplete: (id: number) => void;
  currentEvent: Event | null;
}

const EventListSection = ({
  activeEvents,
  completedEvents,
  onEventEdit,
  onEventDelete,
  onEventComplete,
  currentEvent
}: EventListSectionProps) => {
  const [showCompletedEvents, setShowCompletedEvents] = useState(false);

  // Sort events by time
  const sortedActiveEvents = [...activeEvents].sort((a, b) => 
    new Date(a.time).getTime() - new Date(b.time).getTime()
  );

  const sortedCompletedEvents = [...completedEvents].sort((a, b) => 
    new Date(b.time).getTime() - new Date(a.time).getTime() // Reverse chronological for completed
  );

  return (
    <div className="space-y-4">
      {sortedActiveEvents.length === 0 && (
        <div className="text-center text-[#e8c282aa] py-6">
          No active events for this day
        </div>
      )}
      
      {sortedActiveEvents.map((event) => (
        <ScheduleItem 
          key={event.id}
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
      ))}

      {completedEvents.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-4 md:px-8 z-10">
          <div className="max-w-lg mx-auto">
            <Accordion 
              type="single" 
              collapsible
              className="bg-[#1a1f2c]/95 border border-[#e8c28222] rounded-lg shadow-lg backdrop-blur-sm"
            >
              <AccordionItem value="completed-events" className="border-none">
                <AccordionTrigger className="px-4 py-3 text-[#e8c282] hover:text-[#edd6ae] hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <span>Completed Events ({completedEvents.length})</span>
                    <span className="flex items-center">
                      {showCompletedEvents ? (
                        <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
                      ) : (
                        <>Show More <ChevronDown className="ml-1 h-4 w-4" /></>
                      )}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="max-h-[40vh] overflow-y-auto space-y-2">
                    {sortedCompletedEvents.map((event) => (
                      <div key={event.id} className="transform scale-95 opacity-75 transition-all hover:opacity-90">
                        <ScheduleItem 
                          time={format(new Date(event.time), "h:mm a")}
                          title={event.title}
                          description={event.description}
                          person={event.person}
                          color={event.color}
                          icon={event.icon}
                          progress={100}
                          timeLeft="Completed"
                          location={event.location}
                          completed={true}
                          onEdit={() => onEventEdit(event)}
                          onDelete={() => onEventDelete(event.id)}
                        />
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventListSection;

