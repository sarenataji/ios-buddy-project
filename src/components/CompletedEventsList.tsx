
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ScheduleItem from "@/components/ScheduleItem";
import { Event } from "@/utils/eventUtils";

interface CompletedEventsListProps {
  completedEvents: Event[];
  onEventEdit: (event: Event) => void;
  onEventDelete: (id: number) => void;
}

const CompletedEventsList = ({
  completedEvents,
  onEventEdit,
  onEventDelete,
}: CompletedEventsListProps) => {
  const [showCompletedEvents, setShowCompletedEvents] = useState(false);

  // Sort completed events by time (newest first)
  const sortedCompletedEvents = [...completedEvents].sort((a, b) => 
    new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  if (completedEvents.length === 0) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 px-4 md:px-8 z-10">
      <div className="max-w-lg mx-auto">
        <Collapsible 
          open={showCompletedEvents} 
          onOpenChange={setShowCompletedEvents}
          className="bg-[#1a1f2c]/95 border border-[#e8c28222] rounded-lg shadow-lg backdrop-blur-sm"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-3 text-[#e8c282] hover:text-[#edd6ae]">
            <span>Completed Events ({completedEvents.length})</span>
            <div className="flex items-center">
              {showCompletedEvents ? (
                <>Show Less <ChevronUp className="ml-1 h-4 w-4" /></>
              ) : (
                <>Show More <ChevronDown className="ml-1 h-4 w-4" /></>
              )}
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="px-4 pb-4">
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
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default CompletedEventsList;
