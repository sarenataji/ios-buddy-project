
import { useEffect } from "react";
import { useSchedule } from "@/contexts/ScheduleContext";
import { useToast } from "@/components/ui/use-toast";

const EventCreationHandler = () => {
  const { addEvent } = useSchedule();
  const { toast } = useToast();

  useEffect(() => {
    // Create a handler for the custom event
    const handleNewEvent = (event: Event) => {
      const customEvent = event as CustomEvent;
      const eventData = customEvent.detail;
      
      if (eventData) {
        // Add the event to the schedule
        addEvent(eventData);
        
        // Show a toast
        toast({
          title: "Event created",
          description: `${eventData.title} has been added to your schedule.`,
          variant: "default",
        });
      }
    };

    // Add the event listener
    window.addEventListener('new-event-created', handleNewEvent);
    
    // Clean up
    return () => {
      window.removeEventListener('new-event-created', handleNewEvent);
    };
  }, [addEvent, toast]);

  // This component doesn't render anything
  return null;
};

export default EventCreationHandler;
