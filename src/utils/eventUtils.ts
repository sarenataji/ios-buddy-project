
import { format, isToday, isSameDay } from "date-fns";

export interface Event {
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

export const getEventEndTime = (event: Event) => {
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

export const calculateEventProgress = (event: Event, currentTime: Date) => {
  const eventStart = new Date(event.time);
  const eventEnd = getEventEndTime(event);
  
  if (currentTime < eventStart) {
    return {
      progress: 0,
      timeLeft: formatTimeLeft(eventStart, currentTime),
    };
  }
  
  if (currentTime > eventEnd) {
    return {
      progress: 100,
      timeLeft: "Completed",
    };
  }
  
  const totalDuration = eventEnd.getTime() - eventStart.getTime();
  const elapsed = currentTime.getTime() - eventStart.getTime();
  const progress = Math.min(100, (elapsed / totalDuration) * 100);
  
  return {
    progress,
    timeLeft: formatTimeLeft(eventEnd, currentTime),
  };
};

export const formatTimeLeft = (target: Date, current: Date) => {
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

export const getCurrentEvent = (events: Event[], currentTime: Date) => {
  return events.find(event => {
    const eventStart = new Date(event.time);
    const eventEnd = getEventEndTime(event);
    return currentTime >= eventStart && currentTime <= eventEnd && !event.completed;
  });
};

export const getNextEvent = (events: Event[], currentTime: Date) => {
  const upcoming = events
    .filter(event => new Date(event.time) > currentTime && !event.completed)
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  return upcoming.length > 0 ? upcoming[0] : null;
};
