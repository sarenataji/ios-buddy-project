
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EMOJI_OPTIONS, COLOR_OPTIONS, WEEKDAYS } from "@/utils/scheduleConstants";
import { 
  CalendarIcon, 
  Clock, 
  MapPin, 
  Pencil, 
  StickyNote, 
  CheckCircle, 
  Tag, 
  Repeat, 
  Palette,
  Smile 
} from "lucide-react";
import confetti from "canvas-confetti";

interface StepByStepEventFormProps {
  onSubmit: (event: any) => void;
  onCancel: () => void;
  date: Date;
}

const StepByStepEventForm = ({ onSubmit, onCancel, date }: StepByStepEventFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [person, setPerson] = useState("Personal");
  const [location, setLocation] = useState("");
  const [color, setColor] = useState("#e8c282");
  const [icon, setIcon] = useState("📅");
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [repeatDays, setRepeatDays] = useState<string[]>([]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    },
    exit: { 
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    },
    exit: { 
      y: -20, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const handleWeekdayToggle = (day: string) => {
    setRepeatDays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day);
      } else {
        return [...prev, day];
      }
    });
  };
  
  const steps = [
    {
      title: "What's your event?",
      icon: <Pencil className="h-5 w-5 text-[#e8c282]" />,
      content: (
        <div className="flex flex-col items-center justify-center space-y-6 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-20 h-20 rounded-full bg-[#e8c28233] flex items-center justify-center"
          >
            <Pencil className="h-8 w-8 text-[#e8c282]" />
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#e8c282] font-serif text-center"
          >
            Name your event
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-[#e8c28288] text-center"
          >
            What are you planning?
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Team Meeting"
              className="text-center text-lg bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae] py-6"
              autoFocus
            />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-6"
          >
            <Button
              onClick={() => title.trim() && setCurrentStep(1)}
              disabled={!title.trim()}
              className="bg-[#e8c282] text-[#1a1f2c] hover:bg-[#edd6ae] px-6 py-6 text-lg"
            >
              Continue
            </Button>
          </motion.div>
        </div>
      )
    },
    {
      title: "When is it?",
      icon: <Clock className="h-5 w-5 text-[#e8c282]" />,
      content: (
        <div className="flex flex-col items-center justify-center space-y-6 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-20 h-20 rounded-full bg-[#e8c28233] flex items-center justify-center"
          >
            <Clock className="h-8 w-8 text-[#e8c282]" />
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#e8c282] font-serif text-center"
          >
            Set the time
          </motion.h2>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-[#e8c28288] text-center mb-2"
          >
            For {format(date, "MMMM d, yyyy")}
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full space-y-4"
          >
            <div className="flex flex-col items-center justify-center space-y-2">
              <label className="text-[#e8c282] text-sm">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-40 text-center bg-[#1a1f2c]/80 border border-[#e8c28233] text-[#edd6ae] rounded-md p-3"
                style={{colorScheme: "dark"}}
              />
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-2">
              <label className="text-[#e8c282] text-sm">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-40 text-center bg-[#1a1f2c]/80 border border-[#e8c28233] text-[#edd6ae] rounded-md p-3"
                style={{colorScheme: "dark"}}
              />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-6 flex space-x-3"
          >
            <Button
              onClick={() => setCurrentStep(0)}
              variant="outline"
              className="border-[#e8c28233] text-[#edd6ae] hover:bg-[#e8c28215]"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(2)}
              className="bg-[#e8c282] text-[#1a1f2c] hover:bg-[#edd6ae]"
            >
              Continue
            </Button>
          </motion.div>
        </div>
      )
    },
    {
      title: "Category",
      icon: <Tag className="h-5 w-5 text-[#e8c282]" />,
      content: (
        <div className="flex flex-col items-center justify-center space-y-6 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-20 h-20 rounded-full bg-[#e8c28233] flex items-center justify-center"
          >
            <Tag className="h-8 w-8 text-[#e8c282]" />
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#e8c282] font-serif text-center"
          >
            What category?
          </motion.h2>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-[#e8c28288] text-center"
          >
            Tag your event
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <Input
              value={person}
              onChange={(e) => setPerson(e.target.value)}
              placeholder="e.g., Personal, Work, Family..."
              className="text-center bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
            />
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="w-full flex flex-wrap justify-center gap-2"
          >
            {["Personal", "Work", "Family", "Health", "Social", "Study"].map(category => (
              <Button 
                key={category}
                variant="outline"
                onClick={() => setPerson(category)}
                className={`${
                  person === category 
                    ? "bg-[#e8c282] text-[#1a1f2c] border-[#e8c282]" 
                    : "bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
                }`}
              >
                {category}
              </Button>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-6 flex space-x-3"
          >
            <Button
              onClick={() => setCurrentStep(1)}
              variant="outline"
              className="border-[#e8c28233] text-[#edd6ae] hover:bg-[#e8c28215]"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(3)}
              className="bg-[#e8c282] text-[#1a1f2c] hover:bg-[#edd6ae]"
            >
              Continue
            </Button>
          </motion.div>
        </div>
      )
    },
    {
      title: "Location",
      icon: <MapPin className="h-5 w-5 text-[#e8c282]" />,
      content: (
        <div className="flex flex-col items-center justify-center space-y-6 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-20 h-20 rounded-full bg-[#e8c28233] flex items-center justify-center"
          >
            <MapPin className="h-8 w-8 text-[#e8c282]" />
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#e8c282] font-serif text-center"
          >
            Where is this happening?
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-[#e8c28288] text-center"
          >
            (optional)
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Conference Room B"
              className="text-center bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
            />
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="w-full flex flex-wrap justify-center gap-2"
          >
            {["Home", "Office", "Gym", "Park", "Café", "Online"].map(place => (
              <Button 
                key={place}
                variant="outline"
                onClick={() => setLocation(place)}
                className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae] hover:bg-[#e8c28222]"
              >
                {place}
              </Button>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-6 flex space-x-3"
          >
            <Button
              onClick={() => setCurrentStep(2)}
              variant="outline"
              className="border-[#e8c28233] text-[#edd6ae] hover:bg-[#e8c28215]"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(4)}
              className="bg-[#e8c282] text-[#1a1f2c] hover:bg-[#edd6ae]"
            >
              Continue
            </Button>
          </motion.div>
        </div>
      )
    },
    {
      title: "Style",
      icon: <Palette className="h-5 w-5 text-[#e8c282]" />,
      content: (
        <div className="flex flex-col items-center justify-center space-y-6 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-20 h-20 rounded-full bg-[#e8c28233] flex items-center justify-center overflow-hidden"
            style={{backgroundColor: `${color}33`}}
          >
            <Palette className="h-8 w-8 text-[#e8c282]" style={{color: color}} />
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#e8c282] font-serif text-center"
          >
            Pick a color and icon
          </motion.h2>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <div className="grid grid-cols-6 gap-2">
              {COLOR_OPTIONS.map((colorOption) => (
                <button 
                  key={colorOption} 
                  className={`w-10 h-10 rounded-md border-2 ${color === colorOption ? 'border-white' : 'border-transparent'}`}
                  style={{backgroundColor: colorOption}}
                  onClick={() => setColor(colorOption)}
                  aria-label={`Select color ${colorOption}`}
                />
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="w-full"
          >
            <div className="grid grid-cols-6 gap-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button 
                  key={emoji} 
                  className={`w-10 h-10 flex items-center justify-center rounded-md border-2 ${
                    icon === emoji ? 'border-[#e8c282] bg-[#e8c28222]' : 'border-transparent'
                  }`}
                  onClick={() => setIcon(emoji)}
                  aria-label={`Select emoji ${emoji}`}
                >
                  <span className="text-xl">{emoji}</span>
                </button>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-6 flex space-x-3"
          >
            <Button
              onClick={() => setCurrentStep(3)}
              variant="outline"
              className="border-[#e8c28233] text-[#edd6ae] hover:bg-[#e8c28215]"
            >
              Back
            </Button>
            <Button
              onClick={() => setCurrentStep(5)}
              className="bg-[#e8c282] text-[#1a1f2c] hover:bg-[#edd6ae]"
            >
              Continue
            </Button>
          </motion.div>
        </div>
      )
    },
    {
      title: "Repeat",
      icon: <Repeat className="h-5 w-5 text-[#e8c282]" />,
      content: (
        <div className="flex flex-col items-center justify-center space-y-6 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-20 h-20 rounded-full bg-[#e8c28233] flex items-center justify-center"
          >
            <Repeat className="h-8 w-8 text-[#e8c282]" />
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#e8c282] font-serif text-center"
          >
            Should this repeat?
          </motion.h2>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <button
              onClick={() => setRepeatEnabled(!repeatEnabled)}
              className={`px-5 py-3 rounded-md transition-all ${
                repeatEnabled 
                  ? "bg-[#e8c282] text-[#1a1f2c]" 
                  : "bg-[#1a1f2c]/80 border border-[#e8c28233] text-[#edd6ae]"
              }`}
            >
              {repeatEnabled ? "Yes, repeat" : "No, just once"}
            </button>
          </motion.div>
          
          {repeatEnabled && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full overflow-hidden"
            >
              <p className="text-[#e8c28288] text-center mb-3">Repeat on these days:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {WEEKDAYS.map((day) => (
                  <Button
                    key={day}
                    type="button"
                    variant={repeatDays.includes(day) ? "default" : "outline"}
                    className={
                      repeatDays.includes(day)
                        ? "bg-[#e8c282] text-[#1a1f2c] hover:bg-[#e8c282cc]"
                        : "border-[#e8c28233] text-[#e8c282] hover:bg-[#e8c28222] hover:text-[#edd6ae]"
                    }
                    onClick={() => handleWeekdayToggle(day)}
                  >
                    {day.slice(0, 3)}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-6 flex space-x-3"
          >
            <Button
              onClick={() => setCurrentStep(4)}
              variant="outline"
              className="border-[#e8c28233] text-[#edd6ae] hover:bg-[#e8c28215]"
            >
              Back
            </Button>
            <Button
              onClick={() => {
                setCurrentStep(6);
                // Trigger confetti when reaching final step
                setTimeout(() => {
                  confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                  });
                }, 300);
              }}
              className="bg-[#e8c282] text-[#1a1f2c] hover:bg-[#edd6ae]"
            >
              Continue
            </Button>
          </motion.div>
        </div>
      )
    },
    {
      title: "Almost done!",
      icon: <CheckCircle className="h-5 w-5 text-[#e8c282]" />,
      content: (
        <div className="flex flex-col items-center justify-center space-y-6 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-20 h-20 rounded-full bg-[#2a7b5333] flex items-center justify-center"
          >
            <CheckCircle className="h-8 w-8 text-[#2a7b53]" />
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#e8c282] font-serif text-center"
          >
            Your event is ready!
          </motion.h2>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full space-y-3 bg-[#1a1f2c]/80 border border-[#e8c28233] rounded-lg p-4"
          >
            <div className="flex justify-between border-b border-[#e8c28233] pb-2">
              <span className="text-[#e8c28288]">Title:</span>
              <span className="text-[#edd6ae] font-medium">{title}</span>
            </div>
            <div className="flex justify-between border-b border-[#e8c28233] pb-2">
              <span className="text-[#e8c28288]">Time:</span>
              <span className="text-[#edd6ae]">{`${startTime} - ${endTime}`}</span>
            </div>
            <div className="flex justify-between border-b border-[#e8c28233] pb-2">
              <span className="text-[#e8c28288]">Category:</span>
              <span className="text-[#edd6ae]">{person}</span>
            </div>
            {location && (
              <div className="flex justify-between border-b border-[#e8c28233] pb-2">
                <span className="text-[#e8c28288]">Location:</span>
                <span className="text-[#edd6ae]">{location}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-[#e8c28233] pb-2">
              <span className="text-[#e8c28288]">Color:</span>
              <div 
                className="w-5 h-5 rounded-full" 
                style={{ backgroundColor: color }}
              />
            </div>
            <div className="flex justify-between border-b border-[#e8c28233] pb-2">
              <span className="text-[#e8c28288]">Icon:</span>
              <span className="text-[#edd6ae]">{icon}</span>
            </div>
            {repeatEnabled && (
              <div className="pt-2">
                <span className="text-[#e8c28288] block">Repeats on:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {repeatDays.length > 0 ? 
                    repeatDays.map(day => (
                      <span key={day} className="text-xs bg-[#e8c28222] text-[#e8c282] rounded px-2 py-1">
                        {day.slice(0, 3)}
                      </span>
                    )) : 
                    <span className="text-[#e8c28266]">No days selected</span>
                  }
                </div>
              </div>
            )}
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-6 flex space-x-3"
          >
            <Button
              onClick={() => setCurrentStep(5)}
              variant="outline"
              className="border-[#e8c28233] text-[#edd6ae] hover:bg-[#e8c28215]"
            >
              Back
            </Button>
            <Button
              onClick={() => {
                const [startHours, startMinutes] = startTime.split(':');
                const [endHours, endMinutes] = endTime.split(':');
                
                const eventTime = new Date(date);
                eventTime.setHours(parseInt(startHours), parseInt(startMinutes));
                
                const eventEnd = new Date(date);
                eventEnd.setHours(parseInt(endHours), parseInt(endMinutes));
                
                const eventDescription = `${startTime} - ${endTime}`;
                
                const newEvent = {
                  time: eventTime,
                  title,
                  description: eventDescription,
                  person,
                  color,
                  completed: false,
                  location: location || undefined,
                  icon,
                  repeat: {
                    enabled: repeatEnabled,
                    days: repeatDays,
                  }
                };
                
                onSubmit(newEvent);
                
                // Extra confetti on submit
                confetti({
                  particleCount: 200,
                  spread: 100,
                  origin: { y: 0.5 }
                });
              }}
              className="bg-[#2a7b53] text-white hover:bg-[#35946a]"
            >
              Add to Schedule
            </Button>
          </motion.div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Progress bar */}
      <div className="relative pb-8">
        <div className="absolute h-1 w-full bg-[#e8c28222] rounded-full"></div>
        <motion.div 
          className="absolute h-1 bg-[#e8c282] rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
        
        <div className="relative flex justify-between pt-4">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              <motion.div 
                className={`w-8 h-8 rounded-full flex items-center justify-center z-10
                  ${index <= currentStep ? 'bg-[#e8c282]' : 'bg-[#e8c28233]'}
                `}
                animate={{
                  scale: index === currentStep ? [1, 1.2, 1] : 1,
                  backgroundColor: index <= currentStep ? '#e8c282' : '#e8c28233',
                }}
                transition={{ duration: 0.3 }}
              >
                {step.icon}
              </motion.div>
              
              {index < steps.length - 1 && (
                <motion.div 
                  className="hidden"
                  initial={false}
                  animate={{ opacity: index < currentStep ? 1 : 0.3 }}
                >
                  ——
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentStep}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className="py-4"
        >
          {steps[currentStep].content}
        </motion.div>
      </AnimatePresence>
      
      {/* Cancel button */}
      <motion.div 
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button 
          onClick={onCancel}
          className="text-[#e8c28266] hover:text-[#e8c282] transition-colors"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
};

export default StepByStepEventForm;
