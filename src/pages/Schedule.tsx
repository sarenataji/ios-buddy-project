
import React, { useState, useEffect, useRef } from "react";
import { format, addDays, isToday, isPast, isFuture, isWithinInterval, parseISO } from "date-fns";
import { Plus, ArrowLeft, ArrowRight, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ScheduleItem from "@/components/ScheduleItem";
import TimelineProgress from "@/components/TimelineProgress";
import CountdownTimer from "@/components/CountdownTimer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Sample schedule data
const generateSchedule = (baseDate: Date) => {
  const today = new Date(baseDate);
  today.setHours(0, 0, 0, 0);
  
  return [
    {
      id: 1,
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 30),
      title: "Morning Review",
      description: "8:30 - 9:00",
      person: "Personal",
      color: "#9b87f5", // Purple from color palette
      completed: false,
      location: "Home Office",
    },
    {
      id: 2,
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
      title: "Weekly Team Meeting",
      description: "10:00 - 11:30",
      person: "Team",
      color: "#e8c282", // Gold from profile
      completed: false,
      location: "Conference Room B",
    },
    {
      id: 3,
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
      title: "Lunch Break",
      description: "13:00 - 14:00",
      person: "Personal",
      color: "#7E69AB", // Secondary purple
      completed: false,
      location: "Cafeteria",
    },
    {
      id: 4,
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30),
      title: "Project Planning",
      description: "15:30 - 16:30",
      person: "Client",
      color: "#6E59A5", // Tertiary purple
      completed: false,
      location: "Meeting Room 3",
    },
    {
      id: 5,
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0),
      title: "Daily Wrap-up",
      description: "17:00 - 17:30",
      person: "Personal",
      color: "#D6BCFA", // Light purple
      completed: false,
      location: "Home Office",
    }
  ];
};

interface Event {
  id: number;
  time: Date;
  title: string;
  description: string;
  person: string;
  color: string;
  completed: boolean;
  location?: string;
}

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [schedule, setSchedule] = useState<Event[]>(() => generateSchedule(currentDate));
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [showCompletedEvents, setShowCompletedEvents] = useState(false);
  const [isAddEventSheetOpen, setIsAddEventSheetOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "",
    endTime: "",
    person: "Personal",
    location: "",
  });
  
  const { toast } = useToast();
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      updateEventStatus();
    }, 10000); // Every 10 seconds
    
    return () => clearInterval(interval);
  }, [schedule]);
  
  // Function to navigate to previous/next day with animation
  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
    const newSchedule = generateSchedule(newDate);
    
    // Apply animation class and then set new schedule
    if (timelineRef.current) {
      timelineRef.current.classList.add(direction === 'prev' ? 'animate-slide-out-right' : 'animate-slide-in-right');
      setTimeout(() => {
        setSchedule(newSchedule);
        if (timelineRef.current) {
          timelineRef.current.classList.remove(direction === 'prev' ? 'animate-slide-out-right' : 'animate-slide-in-right');
        }
      }, 300);
    } else {
      setSchedule(newSchedule);
    }
  };
  
  // Update event status based on current time
  const updateEventStatus = () => {
    const now = new Date();
    setSchedule(prev => prev.map(event => {
      const eventEnd = getEventEndTime(event);
      if (now > eventEnd) {
        return { ...event, completed: true };
      }
      return event;
    }));
  };
  
  // Get event end time
  const getEventEndTime = (event: Event) => {
    // Parse event duration (assuming format like "8:30 - 9:00")
    const durationParts = event.description.split(' - ');
    const eventEnd = new Date(event.time);
    
    if (durationParts.length === 2) {
      const endTimeParts = durationParts[1].split(':');
      if (endTimeParts.length === 2) {
        eventEnd.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]));
        return eventEnd;
      }
    }
    
    // Default: add 1 hour if we can't parse end time
    eventEnd.setHours(eventEnd.getHours() + 1);
    return eventEnd;
  };
  
  // Filter completed and active events
  const completedEvents = schedule.filter(event => event.completed);
  const activeEvents = schedule.filter(event => !event.completed);
  
  // Get current event (if any)
  const getCurrentEvent = () => {
    const now = new Date();
    return schedule.find(event => {
      const eventStart = new Date(event.time);
      const eventEnd = getEventEndTime(event);
      return now >= eventStart && now <= eventEnd;
    });
  };
  
  // Get next upcoming event
  const getNextEvent = () => {
    const now = new Date();
    const upcoming = schedule
      .filter(event => event.time > now && !event.completed)
      .sort((a, b) => a.time.getTime() - b.time.getTime());
    return upcoming.length > 0 ? upcoming[0] : null;
  };
  
  const currentEvent = getCurrentEvent();
  const nextEvent = !currentEvent ? getNextEvent() : null;
  
  // Format events for timeline with markers
  const timelineEvents = schedule.map(event => ({
    time: event.time,
    label: event.title,
    completed: event.completed,
    color: event.color,
  }));
  
  // Calculate progress and time left for each event
  const calculateEventProgress = (event: Event) => {
    const now = new Date();
    const eventStart = new Date(event.time);
    const eventEnd = getEventEndTime(event);
    
    // Event hasn't started yet
    if (now < eventStart) {
      return {
        progress: 0,
        timeLeft: formatTimeLeft(eventStart, now),
      };
    }
    
    // Event has ended
    if (now > eventEnd) {
      return {
        progress: 100,
        timeLeft: "Completed",
      };
    }
    
    // Event is in progress
    const totalDuration = eventEnd.getTime() - eventStart.getTime();
    const elapsed = now.getTime() - eventStart.getTime();
    const progress = Math.min(100, (elapsed / totalDuration) * 100);
    
    return {
      progress,
      timeLeft: formatTimeLeft(eventEnd, now),
    };
  };
  
  // Format time left as "1h 30m" or "30m" or "5m left"
  const formatTimeLeft = (target: Date, current: Date) => {
    const diff = target.getTime() - current.getTime();
    if (diff <= 0) return "0m left";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    let result = "";
    
    if (hours > 0) {
      result += `${hours}h `;
    }
    
    if (minutes > 0 || (hours === 0 && minutes === 0)) {
      result += `${minutes}m `;
    }
    
    if (hours === 0 || (hours === 0 && minutes < 10)) {
      result += `${seconds}s`;
    }
    
    return result + " left";
  };
  
  // Handle edit event
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEditDialogOpen(true);
  };
  
  // Handle delete event
  const handleDeleteEvent = (eventId: number) => {
    setSchedule(prev => prev.filter(event => event.id !== eventId));
    toast({
      title: "Event deleted",
      description: "The event has been removed from your schedule.",
    });
  };
  
  // Handle add new event
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
    const [endHours, endMinutes] = newEvent.endTime.split(":").map(Number);
    
    const eventTime = new Date(currentDate);
    eventTime.setHours(startHours, startMinutes, 0, 0);
    
    const newScheduleEvent = {
      id: Math.max(0, ...schedule.map(e => e.id)) + 1,
      time: eventTime,
      title: newEvent.title,
      description: `${newEvent.startTime} - ${newEvent.endTime}`,
      person: newEvent.person || "Personal",
      color: "#9b87f5", // Default color
      completed: false,
      location: newEvent.location || undefined,
    };
    
    setSchedule(prev => [...prev, newScheduleEvent].sort((a, b) => a.time.getTime() - b.time.getTime()));
    setIsAddEventSheetOpen(false);
    setNewEvent({
      title: "",
      startTime: "",
      endTime: "",
      person: "Personal",
      location: "",
    });
    
    toast({
      title: "Event added",
      description: "Your new event has been added to the schedule.",
    });
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        {/* Header with navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateDay('prev')}
            className="text-[#e8c282] hover:text-[#edd6ae] hover:bg-[#e8c28222]"
          >
            <ArrowLeft size={20} />
          </Button>
          
          <h1 className="text-xl text-[#edd6ae] font-serif">
            {format(currentDate, "EEEE, d MMMM")}
          </h1>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateDay('next')}
            className="text-[#e8c282] hover:text-[#edd6ae] hover:bg-[#e8c28222]"
          >
            <ArrowRight size={20} />
          </Button>
        </div>
        
        {/* Location indicator */}
        <div className="text-center mb-4 text-[#e8c282aa] text-sm">
          antalya, turkey
        </div>
        
        {/* Next/Current event countdown */}
        <div className="mb-8 p-4 bg-[#1a1f2c]/80 rounded-lg border border-[#e8c28233] shadow-[0_4px_15px_0_#e8c28215]">
          {currentEvent ? (
            <>
              <div className="text-[#e8c282] text-sm mb-2">
                <span className="font-medium">Current Event:</span> {currentEvent.title}
              </div>
              <CountdownTimer targetDate={getEventEndTime(currentEvent)} />
            </>
          ) : nextEvent ? (
            <>
              <div className="text-[#e8c282] text-sm mb-2">
                <span className="font-medium">Next Event In:</span> {nextEvent.title}
              </div>
              <CountdownTimer targetDate={nextEvent.time} />
            </>
          ) : (
            <div className="text-[#e8c282] text-center py-2">No upcoming events today</div>
          )}
        </div>
        
        {/* Timeline with current time indicator and event markers */}
        <div ref={timelineRef} className="transition-all duration-300">
          <TimelineProgress 
            currentTime={currentTime} 
            events={timelineEvents}
          />
        </div>
        
        {/* Active events */}
        <div className="mt-6">
          {activeEvents.length === 0 && (
            <div className="text-center text-[#e8c282aa] py-6">
              No active events for this day
            </div>
          )}
          
          {activeEvents.map((event) => {
            const { progress, timeLeft } = calculateEventProgress(event);
            return (
              <ScheduleItem 
                key={event.id}
                time={format(event.time, "h:mm a")}
                title={event.title}
                description={event.description}
                person={event.person}
                color={event.color}
                progress={progress}
                timeLeft={timeLeft}
                location={event.location}
                onEdit={() => handleEditEvent(event)}
                onDelete={() => handleDeleteEvent(event.id)}
              />
            );
          })}
        </div>
        
        {/* Completed events (collapsible) */}
        {completedEvents.length > 0 && (
          <div className="mt-8">
            <button
              className="flex items-center justify-between w-full py-2 text-[#e8c282] hover:text-[#edd6ae] text-sm"
              onClick={() => setShowCompletedEvents(!showCompletedEvents)}
            >
              <span>Completed Events ({completedEvents.length})</span>
              <span>{showCompletedEvents ? "▲" : "▼"}</span>
            </button>
            
            {showCompletedEvents && (
              <div className="mt-2 space-y-4">
                {completedEvents.map((event) => (
                  <ScheduleItem 
                    key={event.id}
                    time={format(event.time, "h:mm a")}
                    title={event.title}
                    description={event.description}
                    person={event.person}
                    color={event.color}
                    progress={100}
                    timeLeft="Completed"
                    location={event.location}
                    completed={true}
                    onEdit={() => handleEditEvent(event)}
                    onDelete={() => handleDeleteEvent(event.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Add new event sheet */}
        <Sheet open={isAddEventSheetOpen} onOpenChange={setIsAddEventSheetOpen}>
          <SheetContent className="bg-[#1a1f2c] border-l border-[#e8c28233] text-[#edd6ae]">
            <SheetHeader>
              <SheetTitle className="text-[#edd6ae]">Add New Event</SheetTitle>
            </SheetHeader>
            
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-[#e8c282]">Event Title</label>
                <Input 
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Enter event title"
                  className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-[#e8c282]">Start Time</label>
                  <Input 
                    type="time"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                    className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#e8c282]">End Time</label>
                  <Input 
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                    className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-[#e8c282]">Person/Category</label>
                <Input 
                  value={newEvent.person}
                  onChange={(e) => setNewEvent({...newEvent, person: e.target.value})}
                  placeholder="Personal, Work, Family..."
                  className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-[#e8c282]">Location (optional)</label>
                <Input 
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  placeholder="Enter location"
                  className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
                />
              </div>
              
              <Button 
                onClick={handleAddEvent}
                className="w-full bg-[#e8c282] hover:bg-[#edd6ae] text-[#1a1f2c]"
              >
                Add Event
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        
        {/* Edit event dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-[#1a1f2c] border border-[#e8c28233] text-[#edd6ae]">
            <DialogHeader>
              <DialogTitle className="text-[#edd6ae]">Edit Event</DialogTitle>
            </DialogHeader>
            
            {editingEvent && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm text-[#e8c282]">Event Title</label>
                  <Input 
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                    className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-[#e8c282]">Time</label>
                  <Input 
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                    placeholder="Format: 10:00 - 11:00"
                    className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-[#e8c282]">Person/Category</label>
                  <Input 
                    value={editingEvent.person}
                    onChange={(e) => setEditingEvent({...editingEvent, person: e.target.value})}
                    className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-[#e8c282]">Location</label>
                  <Input 
                    value={editingEvent.location || ""}
                    onChange={(e) => setEditingEvent({...editingEvent, location: e.target.value})}
                    className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
                  />
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                onClick={() => {
                  setSchedule(prev => prev.map(event => 
                    event.id === editingEvent?.id ? editingEvent : event
                  ));
                  setIsEditDialogOpen(false);
                  toast({
                    title: "Event updated",
                    description: "Your event has been successfully updated.",
                  });
                }}
                className="bg-[#e8c282] hover:bg-[#edd6ae] text-[#1a1f2c]"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Add new event button */}
        <div className="fixed bottom-6 right-6 z-10">
          <Button
            size="icon"
            onClick={() => setIsAddEventSheetOpen(true)}
            className="h-14 w-14 rounded-full bg-[#e8c282] hover:bg-[#edd6ae] text-[#1a1f2c] shadow-lg"
          >
            <Plus size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
