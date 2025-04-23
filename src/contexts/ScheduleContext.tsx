
import React, { createContext, useContext, useState, useEffect } from "react";
import { format, addDays, isSameDay } from "date-fns";

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

interface ScheduleContextType {
  events: Event[];
  addEvent: (event: Omit<Event, "id">) => void;
  updateEvent: (event: Event) => void;
  deleteEvent: (eventId: number) => void;
  getEventsForDate: (date: Date) => Event[];
  toggleEventCompletion: (eventId: number) => void;
  allEventsCompletedForDate: (date: Date) => boolean;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);

  // Load events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("schedule-events");
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents, (key, value) => {
          if (key === "time") return new Date(value);
          return value;
        });
        setEvents(parsedEvents);
      } catch (error) {
        console.error("Failed to parse saved events:", error);
        setEvents(generateInitialEvents(new Date()));
      }
    } else {
      // Generate initial events if nothing is saved
      setEvents(generateInitialEvents(new Date()));
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("schedule-events", JSON.stringify(events));
  }, [events]);

  const generateInitialEvents = (baseDate: Date) => {
    const today = new Date(baseDate);
    today.setHours(0, 0, 0, 0);
    
    return [
      {
        id: 1,
        time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 30),
        title: "Morning Review",
        description: "8:30 - 9:00",
        person: "Personal",
        color: "#7e5a39", // Changed from purple to brown
        completed: false,
        location: "Home Office",
        icon: "☕", // Default icon
      },
      {
        id: 2,
        time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
        title: "Weekly Team Meeting",
        description: "10:00 - 11:30",
        person: "Team",
        color: "#e8c282", // Gold
        completed: false,
        location: "Conference Room B",
        icon: "👥", // Default icon
      },
      {
        id: 3,
        time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
        title: "Lunch Break",
        description: "13:00 - 14:00",
        person: "Personal",
        color: "#8B784A", // Earthy brown
        completed: false,
        location: "Cafeteria",
        icon: "🍽️", // Default icon
      },
      {
        id: 4,
        time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30),
        title: "Project Planning",
        description: "15:30 - 16:30",
        person: "Client",
        color: "#A48C64", // Light brown
        completed: false,
        location: "Meeting Room 3",
        icon: "📝", // Default icon
      },
      {
        id: 5,
        time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0),
        title: "Daily Wrap-up",
        description: "17:00 - 17:30",
        person: "Personal",
        color: "#D6BC8A", // Beige
        completed: false,
        location: "Home Office",
        icon: "🏁", // Default icon
      }
    ];
  };

  const addEvent = (event: Omit<Event, "id">) => {
    const newEvent = {
      ...event,
      id: Math.max(0, ...events.map(e => e.id)) + 1
    };
    
    if (newEvent.repeat?.enabled && newEvent.repeat.days?.length > 0) {
      const repeatedEvents = generateRepeatedEvents(newEvent);
      setEvents(prev => [...prev, ...repeatedEvents]);
    } else {
      setEvents(prev => [...prev, newEvent]);
    }
  };

  const generateRepeatedEvents = (event: Event) => {
    const newEvents = [];
    const dayMap: Record<string, number> = {
      'sunday': 0,
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5,
      'saturday': 6,
    };
    
    // Add the original event
    newEvents.push({...event});
    
    // Generate repeated events for the next 4 weeks
    for (let week = 0; week < 4; week++) {
      event.repeat?.days.forEach(dayName => {
        if (dayName.toLowerCase() in dayMap) {
          const targetDayIndex = dayMap[dayName.toLowerCase()];
          const currentDate = new Date(event.time);
          const currentDayIndex = currentDate.getDay();
          
          // Calculate days to add to get to the next occurrence of this weekday
          let daysToAdd = targetDayIndex - currentDayIndex;
          if (daysToAdd <= 0 && week === 0) {
            daysToAdd += 7; // Move to next week if the day has already passed this week
          } else {
            daysToAdd += week * 7; // Add weeks
          }
          
          if (daysToAdd > 0) { // Don't duplicate the original event
            const newDate = new Date(event.time);
            newDate.setDate(newDate.getDate() + daysToAdd);
            
            newEvents.push({
              ...event,
              id: Math.max(0, ...events.map(e => e.id), ...newEvents.map(e => e.id)) + 1,
              time: newDate,
            });
          }
        }
      });
    }
    
    return newEvents;
  };

  const updateEvent = (updatedEvent: Event) => {
    setEvents(prev => prev.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const deleteEvent = (eventId: number) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(new Date(event.time), date)
    );
  };

  const toggleEventCompletion = (eventId: number) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? {...event, completed: !event.completed} : event
    ));
  };

  const allEventsCompletedForDate = (date: Date) => {
    const dateEvents = getEventsForDate(date);
    return dateEvents.length > 0 && dateEvents.every(event => event.completed);
  };

  return (
    <ScheduleContext.Provider value={{ 
      events, 
      addEvent, 
      updateEvent, 
      deleteEvent, 
      getEventsForDate,
      toggleEventCompletion,
      allEventsCompletedForDate
    }}>
      {children}
    </ScheduleContext.Provider>
  );
};
