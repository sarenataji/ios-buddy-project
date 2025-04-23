
import React from "react";
import { format } from "date-fns";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScheduleHeaderProps {
  currentDate: Date;
  onNavigateDay: (direction: 'prev' | 'next') => void;
}

const ScheduleHeader = ({ currentDate, onNavigateDay }: ScheduleHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigateDay('prev')}
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
          onClick={() => onNavigateDay('next')}
          className="text-[#e8c282] hover:text-[#edd6ae] hover:bg-[#e8c28222]"
        >
          <ArrowRight size={20} />
        </Button>
      </div>
      
      <div className="text-center mb-4 text-[#e8c282aa] text-sm">
        antalya, turkey
      </div>
    </>
  );
};

export default ScheduleHeader;
