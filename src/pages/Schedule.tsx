
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ScheduleItem from "@/components/ScheduleItem";
import TimelineProgress from "@/components/TimelineProgress";
import CountdownTimer from "@/components/CountdownTimer";

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
    },
    {
      id: 2,
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
      title: "Weekly Team Meeting",
      description: "10:00 - 11:30",
      person: "Team",
      color: "#e8c282", // Gold from profile
      completed: false,
    },
    {
      id: 3,
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0),
      title: "Lunch Break",
      description: "13:00 - 14:00",
      person: "Personal",
      color: "#7E69AB", // Secondary purple
      completed: false,
    },
    {
      id: 4,
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30),
      title: "Project Planning",
      description: "15:30 - 16:30",
      person: "Client",
      color: "#6E59A5", // Tertiary purple
      completed: false,
    },
    {
      id: 5,
      time: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0),
      title: "Daily Wrap-up",
      description: "17:00 - 17:30",
      person: "Personal",
      color: "#D6BCFA", // Light purple
      completed: false,
    }
  ];
};

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [schedule, setSchedule] = useState(() => generateSchedule(currentDate));
  
  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Function to navigate to previous/next day
  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
    setSchedule(generateSchedule(newDate));
  };
  
  // Get next upcoming event
  const getNextEvent = () => {
    const now = new Date();
    const upcoming = schedule.filter(event => event.time > now);
    return upcoming.length > 0 ? upcoming[0] : null;
  };
  
  const nextEvent = getNextEvent();
  
  // Format events for timeline
  const timelineEvents = schedule.map(event => ({
    time: event.time,
    label: event.title,
  }));
  
  // Calculate progress and time left for each event
  const calculateEventProgress = (event: any) => {
    const now = new Date();
    const eventStart = new Date(event.time);
    const eventEnd = new Date(eventStart);
    
    // Parse event duration (assuming format like "8:30 - 9:00")
    const durationParts = event.description.split(' - ');
    if (durationParts.length === 2) {
      const endTimeParts = durationParts[1].split(':');
      if (endTimeParts.length === 2) {
        eventEnd.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]));
      }
    }
    
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
    
    if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    }
    return `${minutes}m left`;
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
        
        {/* Next event countdown */}
        {nextEvent && (
          <div className="mb-8 p-4 bg-[#1a1f2c]/80 rounded-lg border border-[#e8c28233] shadow-[0_4px_15px_0_#e8c28215]">
            <div className="text-[#e8c282] text-sm mb-2">Next: {nextEvent.title}</div>
            <CountdownTimer targetDate={nextEvent.time} />
          </div>
        )}
        
        {/* Timeline with current time indicator */}
        <TimelineProgress 
          currentTime={currentTime} 
          events={timelineEvents}
        />
        
        {/* Schedule items */}
        <div className="mt-6">
          {schedule.map((event) => {
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
              />
            );
          })}
        </div>
        
        {/* Add new event button */}
        <div className="fixed bottom-6 right-6 z-10">
          <Button
            size="icon"
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
