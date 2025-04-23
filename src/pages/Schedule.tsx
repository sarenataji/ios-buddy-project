import React, { useState, useEffect, useRef } from "react";
import { format, isToday, addDays } from "date-fns";
import { Clock } from "lucide-react";
import { useSchedule } from "@/contexts/ScheduleContext";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import EventForm from "@/components/EventForm";
import CongratsAnimation from "@/components/CongratsAnimation";
import ScheduleHeader from "@/components/ScheduleHeader";
import EventListSection from "@/components/EventListSection";
import TimelineSection from "@/components/TimelineSection";
import ActionButtons from "@/components/ActionButtons";
import CompletedEventsList from "@/components/CompletedEventsList";
import { 
  getCurrentEvent, 
  getNextEvent,
  getEventEndTime,
  type Event 
} from "@/utils/eventUtils";
import { SAMPLE_EVENTS } from "@/utils/scheduleConstants";

const Schedule = () => {
  const { 
    events, 
    addEvent, 
    updateEvent, 
    deleteEvent, 
    getEventsForDate,
    toggleEventCompletion,
    allEventsCompletedForDate
  } = useSchedule();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showCompletedEvents, setShowCompletedEvents] = useState(false);
  const [isAddEventSheetOpen, setIsAddEventSheetOpen] = useState(false);
  const [showCongratsAnimation, setShowCongratsAnimation] = useState(false);
  const [sampleEventsAdded, setSampleEventsAdded] = useState(false);
  
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "",
    endTime: "",
    person: "Personal",
    location: "",
    color: "#7e5a39",
    icon: "📅",
    repeat: {
      enabled: false,
      days: [] as string[]
    }
  });
  
  const { toast } = useToast();
  const timelineRef = useRef<HTMLDivElement>(null);
  
  const hasCompletedAllEvents = allEventsCompletedForDate(currentDate);
  const dateEvents = getEventsForDate(currentDate);
  const hasEvents = dateEvents.length > 0;
  
  useEffect(() => {
    if (!sampleEventsAdded && events.length < 15) {
      SAMPLE_EVENTS.forEach(sampleEvent => {
        const eventDate = addDays(new Date(), sampleEvent.dayOffset);
        const [startHours, startMinutes] = sampleEvent.startTime.split(":").map(Number);
        
        const eventTime = new Date(eventDate);
        eventTime.setHours(startHours, startMinutes, 0, 0);
        
        const newScheduleEvent = {
          time: eventTime,
          title: sampleEvent.title,
          description: `${sampleEvent.startTime} - ${sampleEvent.endTime}`,
          person: sampleEvent.person,
          color: sampleEvent.color,
          completed: false,
          location: sampleEvent.location,
          icon: sampleEvent.icon,
          repeat: {
            enabled: false,
            days: []
          }
        };
        
        addEvent(newScheduleEvent);
      });
      
      toast({
        title: "Sample events added",
        description: "We've added sample events for today and the upcoming weeks.",
      });
      
      setSampleEventsAdded(true);
    }
  }, []);
  
  useEffect(() => {
    if (hasCompletedAllEvents && hasEvents && isToday(currentDate)) {
      setShowCongratsAnimation(true);
    }
  }, [hasCompletedAllEvents, hasEvents, currentDate]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.startTime || !newEvent.endTime) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    const [startHours, startMinutes] = newEvent.startTime.split(":").map(Number);
    const eventTime = new Date(currentDate);
    eventTime.setHours(startHours, startMinutes, 0, 0);
    
    const newScheduleEvent = {
      time: eventTime,
      title: newEvent.title,
      description: `${newEvent.startTime} - ${newEvent.endTime}`,
      person: newEvent.person || "Personal",
      color: newEvent.color,
      completed: false,
      location: newEvent.location || undefined,
      icon: newEvent.icon,
      repeat: {
        enabled: newEvent.repeat.enabled,
        days: newEvent.repeat.days
      }
    };
    
    addEvent(newScheduleEvent);
    setIsAddEventSheetOpen(false);
    setNewEvent({
      title: "",
      startTime: "",
      endTime: "",
      person: "Personal",
      location: "",
      color: "#7e5a39",
      icon: "📅",
      repeat: {
        enabled: false,
        days: []
      }
    });
    
    toast({
      title: "Event added",
      description: "Your new event has been added to the schedule.",
    });
  };
  
  const handleWeekdayToggle = (day: string, isAdd: boolean, isEditing: boolean = false) => {
    if (isEditing && editingEvent) {
      const updatedEvent = { ...editingEvent };
      if (!updatedEvent.repeat) {
        updatedEvent.repeat = { enabled: true, days: [] };
      }
      
      if (isAdd) {
        updatedEvent.repeat.days = [...updatedEvent.repeat.days, day];
      } else {
        updatedEvent.repeat.days = updatedEvent.repeat.days.filter(d => d !== day);
      }
      
      setEditingEvent(updatedEvent);
    } else {
      setNewEvent(prev => {
        const newRepeatDays = isAdd 
          ? [...prev.repeat.days, day]
          : prev.repeat.days.filter(d => d !== day);
        
        return {
          ...prev,
          repeat: {
            ...prev.repeat,
            days: newRepeatDays
          }
        };
      });
    }
  };
  
  const completedEvents = dateEvents.filter(event => event.completed);
  const activeEvents = dateEvents.filter(event => !event.completed);
  
  const currentEvent = getCurrentEvent(dateEvents, currentTime);
  const nextEvent = !currentEvent ? getNextEvent(dateEvents, currentTime) : null;
  
  const timelineEvents = dateEvents.map(event => ({
    id: event.id,
    time: new Date(event.time),
    label: event.title,
    completed: event.completed,
    color: event.color,
    icon: event.icon,
    location: event.location,
    description: event.description
  }));
  
  const handleEditEvent = (event: Event) => {
    const eventToEdit = {
      ...event,
      repeat: event.repeat || {
        enabled: false,
        days: []
      }
    };
    setEditingEvent(eventToEdit);
    setIsEditDialogOpen(true);
  };
  
  const handleSaveEditedEvent = () => {
    if (editingEvent) {
      updateEvent(editingEvent);
      setIsEditDialogOpen(false);
      toast({
        title: "Event updated",
        description: "Your event has been successfully updated.",
      });
    }
  };
  
  const handleEventSelect = (eventId: number) => {
    const selectedEvent = events.find(event => event.id === eventId);
    if (selectedEvent) {
      const viewEvent = {
        ...selectedEvent
      };
      setEditingEvent(viewEvent);
      setIsEditDialogOpen(true);
    }
  };
  
  const handleNavigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
    
    if (timelineRef.current) {
      timelineRef.current.classList.add(direction === 'prev' ? 'animate-slide-out-right' : 'animate-slide-in-right');
      setTimeout(() => {
        if (timelineRef.current) {
          timelineRef.current.classList.remove(direction === 'prev' ? 'animate-slide-out-right' : 'animate-slide-in-right');
        }
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        <ScheduleHeader 
          currentDate={currentDate}
          onNavigateDay={handleNavigateDay}
        />
        
        <div ref={timelineRef} className="transition-all duration-300">
          <TimelineSection
            currentTime={currentTime}
            currentEvent={currentEvent}
            nextEvent={nextEvent}
            timelineEvents={timelineEvents}
            onEventSelect={handleEventSelect}
          />
        </div>
        
        <EventListSection 
          activeEvents={activeEvents}
          onEventEdit={handleEditEvent}
          onEventDelete={deleteEvent}
          onEventComplete={toggleEventCompletion}
          currentEvent={currentEvent}
        />
        
        <CompletedEventsList 
          completedEvents={completedEvents}
          onEventEdit={handleEditEvent}
          onEventDelete={deleteEvent}
        />
        
        <ActionButtons onAddEvent={() => setIsAddEventSheetOpen(true)} />
        
        {showCongratsAnimation && hasCompletedAllEvents && (
          <CongratsAnimation />
        )}
        
        <Sheet open={isAddEventSheetOpen} onOpenChange={setIsAddEventSheetOpen}>
          <SheetContent className="bg-[#1a1f2c] border-l border-[#e8c28233] text-[#edd6ae] max-w-md w-full">
            <SheetHeader>
              <SheetTitle className="text-[#edd6ae]">Add New Event</SheetTitle>
            </SheetHeader>
            
            <EventForm
              event={newEvent}
              onSubmit={handleAddEvent}
              onChange={setNewEvent}
              onWeekdayToggle={handleWeekdayToggle}
            />
          </SheetContent>
        </Sheet>
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-[#1a1f2c] border border-[#e8c28233] text-[#edd6ae] max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#edd6ae] flex items-center gap-2">
                {editingEvent?.icon && <span>{editingEvent.icon}</span>}
                {editingEvent?.title}
              </DialogTitle>
            </DialogHeader>
            
            {editingEvent && (
              <div className="space-y-4">
                <div className="text-[#e8c282] flex items-center gap-2">
                  <Clock size={16} />
                  {format(new Date(editingEvent.time), "h:mm a")}
                </div>
                {editingEvent.description && (
                  <p className="text-[#e8c282cc]">{editingEvent.description}</p>
                )}
                {editingEvent.location && (
                  <p className="text-[#e8c282aa] flex items-center gap-2">
                    📍 {editingEvent.location}
                  </p>
                )}
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="border-[#e8c28233] text-[#e8c282] hover:bg-[#e8c28215] hover:text-[#edd6ae]"
                    onClick={() => setIsEditDialogOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Schedule;
