
import React from "react";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScheduleHeaderProps {
  currentDate: Date;
  onNavigateDay?: (direction: 'prev' | 'next') => void;
  // Add new props to match Schedule.tsx usage
  onPreviousDay?: () => void;
  onNextDay?: () => void;
  onTodayClick?: () => void;
  completedEventsCount?: number;
  totalEventsCount?: number;
}

const ScheduleHeader = ({ 
  currentDate, 
  onNavigateDay,
  // New props to match Schedule.tsx usage
  onPreviousDay,
  onNextDay,
  onTodayClick,
  completedEventsCount = 0,
  totalEventsCount = 0
}: ScheduleHeaderProps) => {
  // Handle clicks based on which props are provided
  const handlePrevClick = () => {
    if (onPreviousDay) {
      onPreviousDay();
    } else if (onNavigateDay) {
      onNavigateDay('prev');
    }
  };

  const handleNextClick = () => {
    if (onNextDay) {
      onNextDay();
    } else if (onNavigateDay) {
      onNavigateDay('next');
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevClick}
          className="text-[#c69c6d] hover:text-[#a67c50] hover:bg-[#c69c6d22]"
        >
          <ArrowLeft size={20} />
        </Button>
        
        <div className="text-center">
          <h1 className="text-xl text-[#a67c50] font-serif">
            {format(currentDate, "EEEE, d MMMM")}
          </h1>
          
          {totalEventsCount > 0 && (
            <div className="text-xs text-[#c69c6d88] mt-1">
              {completedEventsCount} of {totalEventsCount} events completed
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextClick}
          className="text-[#c69c6d] hover:text-[#a67c50] hover:bg-[#c69c6d22]"
        >
          <ArrowRight size={20} />
        </Button>
      </div>
      
      {onTodayClick && (
        <div className="text-center mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onTodayClick}
            className="text-[#c69c6d] bg-[#2a1f15]/80 border-[#c69c6d33] hover:bg-[#3a2f25] text-xs px-3 py-1 h-7"
          >
            Today
          </Button>
        </div>
      )}
      
      <div className="text-center mb-4 text-[#c69c6daa] text-sm">
        antalya, turkey
      </div>
    </>
  );
};

export default ScheduleHeader;
