import React, { useState, useEffect, useRef } from "react";
import { format, addDays, isToday, isPast, isFuture, isWithinInterval } from "date-fns";
import { Plus, ArrowLeft, ArrowRight, MapPin, Check, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ScheduleItem from "@/components/ScheduleItem";
import TimelineProgress from "@/components/TimelineProgress";
import CountdownTimer from "@/components/CountdownTimer";
import CongratsAnimation from "@/components/CongratsAnimation";
import { useSchedule } from "@/contexts/ScheduleContext";
import { useToast } from "@/components/ui/use-toast";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

const EMOJI_OPTIONS = [
  "📅", "📝", "📌", "🔔", "⏰", "🏃", "🍽️", "☕", 
  "🧠", "💼", "👥", "📞", "🎯", "🎮", "🛌", "🚗", 
  "✈️", "🏠", "🏢", "🏋️", "📚", "💻", "🎵", "🎨"
];

const COLOR_OPTIONS = [
  "#7e5a39", // Brown (primary)
  "#e8c282", // Gold
  "#8B784A", // Earth
  "#A48C64", // Light brown
  "#D6BC8A", // Beige
  "#5D4824", // Dark brown
  "#B9975B", // Amber
  "#CBA76B", // Tan
];

const WEEKDAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", 
  "Thursday", "Friday", "Saturday"
];

interface Event {
  id: number;
  time: Date;
  title: string;
  description: string;
  person: string;
  color: string;
  completed: boolean;
  location?: string;
  icon?: string;
  repeat?: {
    enabled: boolean;
    days: string[];
  };
}

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
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "",
    endTime: "",
    person: "Personal",
    location: "",
    color: "#7e5a39", // Brown color as default
    icon: "📅", // Calendar as default icon
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
  
  const getEventEndTime = (event: Event) => {
    const durationParts = event.description.split(' - ');
    const eventEnd = new Date(event.time);
    
    if (durationParts.length === 2) {
      const endTimeParts = durationParts[1].split(':');
      if (endTimeParts.length === 2) {
        eventEnd.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]));
        return eventEnd;
      }
    }
    
    eventEnd.setHours(eventEnd.getHours() + 1);
    return eventEnd;
  };
  
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
  
  const calculateEventProgress = (event: Event) => {
    const now = new Date();
    const eventStart = new Date(event.time);
    const eventEnd = getEventEndTime(event);
    
    if (now < eventStart) {
      return {
        progress: 0,
        timeLeft: formatTimeLeft(eventStart, now),
      };
    }
    
    if (now > eventEnd) {
      return {
        progress: 100,
        timeLeft: "Completed",
      };
    }
    
    const totalDuration = eventEnd.getTime() - eventStart.getTime();
    const elapsed = now.getTime() - eventStart.getTime();
    const progress = Math.min(100, (elapsed / totalDuration) * 100);
    
    return {
      progress,
      timeLeft: formatTimeLeft(eventEnd, now),
    };
  };
  
  const getCurrentEvent = () => {
    const now = new Date();
    return dateEvents.find(event => {
      const eventStart = new Date(event.time);
      const eventEnd = getEventEndTime(event);
      return now >= eventStart && now <= eventEnd && !event.completed;
    });
  };
  
  const getNextEvent = () => {
    const now = new Date();
    const upcoming = dateEvents
      .filter(event => new Date(event.time) > now && !event.completed)
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
    return upcoming.length > 0 ? upcoming[0] : null;
  };
  
  useEffect(() => {
    if (hasCompletedAllEvents && hasEvents && isToday(currentDate)) {
      setShowCongratsAnimation(true);
    }
  }, [hasCompletedAllEvents, hasEvents, currentDate]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // Every 10 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  const navigateDay = (direction: 'prev' | 'next') => {
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
  
  const completedEvents = dateEvents.filter(event => event.completed);
  const activeEvents = dateEvents.filter(event => !event.completed);
  
  const currentEvent = getCurrentEvent();
  const nextEvent = !currentEvent ? getNextEvent() : null;
  
  const timelineEvents = dateEvents.map(event => ({
    time: new Date(event.time),
    label: event.title,
    completed: event.completed,
    color: event.color,
    icon: event.icon
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
  
  const handleToggleComplete = (eventId: number) => {
    toggleEventCompletion(eventId);
  };
  
  const handleDeleteEvent = (eventId: number) => {
    deleteEvent(eventId);
    toast({
      title: "Event deleted",
      description: "The event has been removed from your schedule.",
    });
  };
  
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
  
  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-lg mx-auto">
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
        
        <div className="text-center mb-4 text-[#e8c282aa] text-sm">
          antalya, turkey
        </div>
        
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
              <CountdownTimer targetDate={new Date(nextEvent.time)} />
            </>
          ) : (
            <div className="text-[#e8c282] text-center py-2">No upcoming events {isToday(currentDate) ? "today" : "on this day"}</div>
          )}
        </div>
        
        <div ref={timelineRef} className="transition-all duration-300">
          <TimelineProgress 
            currentTime={currentTime} 
            events={timelineEvents}
          />
        </div>
        
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
                time={format(new Date(event.time), "h:mm a")}
                title={event.title}
                description={event.description}
                person={event.person}
                color={event.color}
                icon={event.icon}
                progress={progress}
                timeLeft={timeLeft}
                location={event.location}
                onEdit={() => handleEditEvent(event)}
                onDelete={() => handleDeleteEvent(event.id)}
                onComplete={() => handleToggleComplete(event.id)}
              />
            );
          })}
        </div>
        
        {completedEvents.length > 0 && (
          <div className="mt-8">
            <Collapsible 
              open={showCompletedEvents} 
              onOpenChange={setShowCompletedEvents}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-[#e8c282] hover:text-[#edd6ae] text-sm">
                <span>Completed Events ({completedEvents.length})</span>
                <span>{showCompletedEvents ? "▲" : "▼"}</span>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-2 space-y-4">
                {completedEvents.map((event) => (
                  <ScheduleItem 
                    key={event.id}
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
                    onEdit={() => handleEditEvent(event)}
                    onDelete={() => handleDeleteEvent(event.id)}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}
        
        {showCongratsAnimation && hasCompletedAllEvents && (
          <CongratsAnimation />
        )}
        
        <Sheet open={isAddEventSheetOpen} onOpenChange={setIsAddEventSheetOpen}>
          <SheetContent className="bg-[#1a1f2c] border-l border-[#e8c28233] text-[#edd6ae] max-w-md w-full">
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
                    style={{colorScheme: "dark"}}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#e8c282]">End Time</label>
                  <Input 
                    type="time"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
                    className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
                    style={{colorScheme: "dark"}}
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
              
              <div className="space-y-2">
                <label className="text-sm text-[#e8c282] mb-1 block">Icon</label>
                <div className="flex space-x-2">
                  <div 
                    className="h-10 w-10 flex items-center justify-center rounded border border-[#e8c28233] bg-[#1a1f2c]/80 cursor-pointer"
                    onClick={() => setEmojiPickerOpen(true)}
                  >
                    <span className="text-xl">{newEvent.icon}</span>
                  </div>
                  
                  <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae] hover:bg-[#e8c28222]">
                        Choose Icon
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 bg-[#1a1f2c] border border-[#e8c28233]">
                      <div className="grid grid-cols-6 gap-2">
                        {EMOJI_OPTIONS.map((emoji) => (
                          <Button 
                            key={emoji} 
                            variant="ghost" 
                            className="h-9 w-9 p-0 hover:bg-[#e8c28222]"
                            onClick={() => {
                              setNewEvent({...newEvent, icon: emoji});
                              setEmojiPickerOpen(false);
                            }}
                          >
                            <span className="text-xl">{emoji}</span>
                          </Button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-[#e8c282] mb-1 block">Color</label>
                <div className="flex space-x-2">
                  <div 
                    className="h-10 w-10 rounded border border-[#e8c28233] cursor-pointer"
                    style={{backgroundColor: newEvent.color}}
                    onClick={() => setColorPickerOpen(true)}
                  />
                  
                  <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae] hover:bg-[#e8c28222]">
                        Choose Color
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-64 bg-[#1a1f2c] border border-[#e8c28233]">
                      <div className="grid grid-cols-4 gap-2">
                        {COLOR_OPTIONS.map((color) => (
                          <Button 
                            key={color} 
                            variant="ghost" 
                            className="h-8 w-12 p-0 border border-[#e8c28233]"
                            style={{backgroundColor: color}}
                            onClick={() => {
                              setNewEvent({...newEvent, color});
                              setColorPickerOpen(false);
                            }}
                          />
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="repeat-event"
                    checked={newEvent.repeat.enabled}
                    onChange={(e) => setNewEvent({
                      ...newEvent,
                      repeat: {
                        ...newEvent.repeat,
                        enabled: e.target.checked
                      }
                    })}
                    className="rounded border-[#e8c28233] bg-[#1a1f2c]/80 text-[#e8c282]"
                  />
                  <label htmlFor="repeat-event" className="text-sm text-[#e8c282]">
                    Repeat Event
                  </label>
                </div>
                
                {newEvent.repeat.enabled && (
                  <div className="ml-6 mt-2">
                    <p className="text-xs text-[#e8c282aa] mb-2">Select days to repeat:</p>
                    <div className="flex flex-wrap gap-2">
                      {WEEKDAYS.map((day) => (
                        <Button
                          key={day}
                          type="button"
                          variant={newEvent.repeat.days.includes(day) ? "default" : "outline"}
                          className={
                            newEvent.repeat.days.includes(day)
                              ? "bg-[#e8c282] text-[#1a1f2c] hover:bg-[#e8c282cc] h-8"
                              : "border-[#e8c28233] text-[#e8c282] hover:bg-[#e8c28222] hover:text-[#edd6ae] h-8"
                          }
                          onClick={() => handleWeekdayToggle(
                            day,
                            !newEvent.repeat.days.includes(day)
                          )}
                        >
                          {day.slice(0, 3)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
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
        
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-[#1a1f2c] border border-[#e8c28233] text-[#edd6ae] max-w-md">
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
                
                <div className="space-y-2">
                  <label className="text-sm text-[#e8c282] mb-1 block">Icon</label>
                  <div className="flex space-x-2">
                    <div 
                      className="h-10 w-10 flex items-center justify-center rounded border border-[#e8c28233] bg-[#1a1f2c]/80 cursor-pointer"
                    >
                      <span className="text-xl">{editingEvent.icon || "📅"}</span>
                    </div>
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae] hover:bg-[#e8c28222]">
                          Choose Icon
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 bg-[#1a1f2c] border border-[#e8c28233]">
                        <div className="grid grid-cols-6 gap-2">
                          {EMOJI_OPTIONS.map((emoji) => (
                            <Button 
                              key={emoji} 
                              variant="ghost" 
                              className="h-9 w-9 p-0 hover:bg-[#e8c28222]"
                              onClick={() => {
                                setEditingEvent({...editingEvent, icon: emoji});
                              }}
                            >
                              <span className="text-xl">{emoji}</span>
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-[#e8c282] mb-1 block">Color</label>
                  <div className="flex space-x-2">
                    <div 
                      className="h-10 w-10 rounded border border-[#e8c28233] cursor-pointer"
                      style={{backgroundColor: editingEvent.color || "#7e5a39"}}
                    />
                    
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae] hover:bg-[#e8c28222]">
                          Choose Color
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 bg-[#1a1f2c] border border-[#e8c28233]">
                        <div className="grid grid-cols-4 gap-2">
                          {COLOR_OPTIONS.map((color) => (
                            <Button 
                              key={color} 
                              variant="ghost" 
                              className="h-8 w-12 p-0 border border-[#e8c28233]"
                              style={{backgroundColor: color}}
                              onClick={() => {
                                setEditingEvent({...editingEvent, color});
                              }}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit-repeat-event"
                      checked={editingEvent.repeat?.enabled || false}
                      onChange={(e) => setEditingEvent({
                        ...editingEvent,
                        repeat: {
                          ...editingEvent.repeat,
                          enabled: e.target.checked,
                          days: editingEvent.repeat?.days || []
                        }
                      })}
                      className="rounded border-[#e8c28233] bg-[#1a1f2c]/80 text-[#e8c282]"
                    />
                    <label htmlFor="edit-repeat-event" className="text-sm text-[#e8c282] flex items-center gap-1">
                      <Repeat size={14} />
                      Repeat Event
                    </label>
                  </div>
                  
                  {editingEvent.repeat?.enabled && (
                    <div className="ml-6 mt-2">
                      <p className="text-xs text-[#e8c282aa] mb-2">Select days to repeat:</p>
                      <div className="flex flex-wrap gap-2">
                        {WEEKDAYS.map((day) => (
                          <Button
                            key={day}
                            type="button"
                            variant={editingEvent.repeat?.days?.includes(day) ? "default" : "outline"}
                            className={
                              editingEvent.repeat?.days?.includes(day)
                                ? "bg-[#e8c282] text-[#1a1f2c] hover:bg-[#e8c282cc] h-8"
                                : "border-[#e8c28233] text-[#e8c282] hover:bg-[#e8c28222] hover:text-[#edd6ae] h-8"
                            }
                            onClick={() => handleWeekdayToggle(
                              day,
                              !editingEvent.repeat?.days?.includes(day),
                              true
                            )}
                          >
                            {day.slice(0, 3)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <DialogFooter>
              <Button 
                onClick={handleSaveEditedEvent}
                className="bg-[#e8c282] hover:bg-[#edd6ae] text-[#1a1f2c]"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
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
