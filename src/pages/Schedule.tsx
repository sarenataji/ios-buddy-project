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
      location: newEvent.location || "",
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
    const timeStr = format(new Date(event.time), "HH:mm");
    
    let endTimeStr = "";
    if (event.description) {
      const parts = event.description.split(" - ");
      if (parts.length > 1) {
        endTimeStr = parts[1];
      }
    }
    
    const formEvent = {
      title: event.title,
      startTime: timeStr,
      endTime: endTimeStr,
      person: event.person,
      location: event.location || "",
      color: event.color,
      icon: event.icon || "📅",
      repeat: event.repeat || {
        enabled: false,
        days: []
      }
    };
    
    const eventToEdit = {
      ...event,
      formData: formEvent
    };
    
    setEditingEvent(eventToEdit);
    setIsEditDialogOpen(true);
  };
  
  const handleSaveEditedEvent = () => {
    if (editingEvent && editingEvent.formData) {
      const { formData } = editingEvent;
      
      const [startHours, startMinutes] = formData.startTime.split(":").map(Number);
      const updatedTime = new Date(editingEvent.time);
      updatedTime.setHours(startHours, startMinutes, 0, 0);
      
      const updatedEvent = {
        ...editingEvent,
        time: updatedTime,
        title: formData.title,
        description: `${formData.startTime} - ${formData.endTime}`,
        person: formData.person,
        color: formData.color,
        location: formData.location,
        icon: formData.icon,
        repeat: formData.repeat
      };
      
      delete (updatedEvent as any).formData;
      
      updateEvent(updatedEvent);
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
      handleEditEvent(selectedEvent);
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
  
  const getEventFormData = () => {
    if (!editingEvent) return null;
    
    if ((editingEvent as any).formData) {
      return (editingEvent as any).formData;
    }
    
    const timeStr = format(new Date(editingEvent.time), "HH:mm");
    
    let endTimeStr = "";
    if (editingEvent.description) {
      const parts = editingEvent.description.split(" - ");
      if (parts.length > 1) {
        endTimeStr = parts[1];
      }
    }
    
    return {
      title: editingEvent.title,
      startTime: timeStr,
      endTime: endTimeStr,
      person: editingEvent.person,
      location: editingEvent.location || "",
      color: editingEvent.color,
      icon: editingEvent.icon || "📅",
      repeat: editingEvent.repeat || {
        enabled: false,
        days: []
      }
    };
  };
  
  const handleEditFormChange = (updatedForm: any) => {
    if (editingEvent) {
      setEditingEvent({
        ...editingEvent,
        formData: updatedForm
      } as any);
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
                Edit Event
              </DialogTitle>
            </DialogHeader>
            
            {editingEvent && getEventFormData() && (
              <div className="space-y-4">
                <EventForm
                  event={getEventFormData()!}
                  isEditing={true}
                  onSubmit={handleSaveEditedEvent}
                  onChange={handleEditFormChange}
                  onWeekdayToggle={handleWeekdayToggle}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Schedule;
