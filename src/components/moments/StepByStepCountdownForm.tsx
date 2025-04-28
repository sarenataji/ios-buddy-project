
import { useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock, MapPin, Pencil, StickyNote, CheckCircle, Timer } from "lucide-react";
import confetti from "canvas-confetti";

interface StepByStepCountdownFormProps {
  onSubmit: (data: {
    title: string;
    startDate: Date;
    endDate: Date;
    location?: string;
    note?: string;
  }) => void;
  onCancel: () => void;
}

const StepByStepCountdownForm = ({ onSubmit, onCancel }: StepByStepCountdownFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [startTime, setStartTime] = useState(format(new Date(), "HH:mm"));
  const [endTime, setEndTime] = useState(format(new Date(), "HH:mm"));
  const [dateType, setDateType] = useState<"start" | "end">("start");
  
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

  const steps = [
    {
      title: "What are you counting down to?",
      icon: <Pencil className="h-5 w-5 text-[#e8c282]" />,
      content: (
        <div className="flex flex-col items-center justify-center space-y-6 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-20 h-20 rounded-full bg-[#e8c28233] flex items-center justify-center"
          >
            <Timer className="h-8 w-8 text-[#e8c282]" />
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#e8c282] font-serif text-center"
          >
            Name your countdown
          </motion.h2>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full"
          >
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Trip to Paris"
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
      title: "Start Date",
      icon: <CalendarIcon className="h-5 w-5 text-[#e8c282]" />,
      content: (
        <div className="flex flex-col items-center justify-center space-y-6 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-20 h-20 rounded-full bg-[#e8c28233] flex items-center justify-center"
          >
            <CalendarIcon className="h-8 w-8 text-[#e8c282]" />
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#e8c282] font-serif text-center"
          >
            When does it start?
          </motion.h2>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full flex justify-center"
          >
            <div className="bg-[#1a1f2c]/80 border border-[#e8c28233] rounded-lg p-1">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                className="text-[#edd6ae]"
              />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full flex items-center space-x-4"
          >
            <div className="flex items-center space-x-2 bg-[#1a1f2c]/80 border border-[#e8c28233] p-2 rounded-md">
              <Clock className="h-5 w-5 text-[#e8c282]" />
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="bg-transparent text-[#edd6ae] focus:outline-none"
              />
            </div>
            
            <div className="text-[#e8c28277]">
              {startDate && format(startDate, "MMMM d, yyyy")}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
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
              disabled={!startDate}
              className="bg-[#e8c282] text-[#1a1f2c] hover:bg-[#edd6ae]"
            >
              Continue
            </Button>
          </motion.div>
        </div>
      )
    },
    {
      title: "End Date",
      icon: <Timer className="h-5 w-5 text-[#e8c282]" />,
      content: (
        <div className="flex flex-col items-center justify-center space-y-6 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-20 h-20 rounded-full bg-[#e8c28233] flex items-center justify-center"
          >
            <Timer className="h-8 w-8 text-[#e8c282]" />
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#e8c282] font-serif text-center"
          >
            When does it end?
          </motion.h2>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full flex justify-center"
          >
            <div className="bg-[#1a1f2c]/80 border border-[#e8c28233] rounded-lg p-1">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                className="text-[#edd6ae]"
                disabled={(date) => {
                  if (!startDate) return false;
                  return date < startDate;
                }}
              />
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="w-full flex items-center space-x-4"
          >
            <div className="flex items-center space-x-2 bg-[#1a1f2c]/80 border border-[#e8c28233] p-2 rounded-md">
              <Clock className="h-5 w-5 text-[#e8c282]" />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="bg-transparent text-[#edd6ae] focus:outline-none"
              />
            </div>
            
            <div className="text-[#e8c28277]">
              {endDate && format(endDate, "MMMM d, yyyy")}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
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
              disabled={!endDate}
              className="bg-[#e8c282] text-[#1a1f2c] hover:bg-[#edd6ae]"
            >
              Continue
            </Button>
          </motion.div>
        </div>
      )
    },
    {
      title: "Where is it happening?",
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
              placeholder="e.g., Paris, France"
              className="text-center bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
            />
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
      title: "Add some notes",
      icon: <StickyNote className="h-5 w-5 text-[#e8c282]" />,
      content: (
        <div className="flex flex-col items-center justify-center space-y-6 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-20 h-20 rounded-full bg-[#e8c28233] flex items-center justify-center"
          >
            <StickyNote className="h-8 w-8 text-[#e8c282]" />
          </motion.div>
          
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#e8c282] font-serif text-center"
          >
            Any notes to add?
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
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add any notes about this countdown..."
              className="w-full min-h-[120px] bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae] rounded-md p-3 text-center placeholder:text-[#e8c28277]"
            />
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
              onClick={() => {
                setCurrentStep(5);
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
            Your countdown is ready!
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
              <span className="text-[#e8c28288]">Start:</span>
              <span className="text-[#edd6ae]">
                {startDate ? `${format(startDate, "PPP")} at ${startTime}` : "-"}
              </span>
            </div>
            <div className="flex justify-between border-b border-[#e8c28233] pb-2">
              <span className="text-[#e8c28288]">End:</span>
              <span className="text-[#edd6ae]">
                {endDate ? `${format(endDate, "PPP")} at ${endTime}` : "-"}
              </span>
            </div>
            {location && (
              <div className="flex justify-between border-b border-[#e8c28233] pb-2">
                <span className="text-[#e8c28288]">Location:</span>
                <span className="text-[#edd6ae]">{location}</span>
              </div>
            )}
            {note && (
              <div className="pt-2">
                <span className="text-[#e8c28288] block">Notes:</span>
                <span className="text-[#edd6ae] block mt-1 text-sm">{note}</span>
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
              onClick={() => setCurrentStep(4)}
              variant="outline"
              className="border-[#e8c28233] text-[#edd6ae] hover:bg-[#e8c28215]"
            >
              Back
            </Button>
            <Button
              onClick={() => {
                if (startDate && endDate) {
                  const finalStartDate = new Date(startDate);
                  const finalEndDate = new Date(endDate);
                  const [startHours, startMinutes] = startTime.split(':');
                  const [endHours, endMinutes] = endTime.split(':');
                  
                  finalStartDate.setHours(parseInt(startHours), parseInt(startMinutes));
                  finalEndDate.setHours(parseInt(endHours), parseInt(endMinutes));
                  
                  onSubmit({
                    title,
                    startDate: finalStartDate,
                    endDate: finalEndDate,
                    location: location || undefined,
                    note: note || undefined,
                  });
                  
                  // Extra confetti on submit
                  confetti({
                    particleCount: 200,
                    spread: 100,
                    origin: { y: 0.5 }
                  });
                }
              }}
              className="bg-[#2a7b53] text-white hover:bg-[#35946a]"
            >
              Save Countdown
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

export default StepByStepCountdownForm;
