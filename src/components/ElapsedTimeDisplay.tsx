
import React, { useState, useEffect } from "react";
import { Clock, Pencil } from "lucide-react";
import { differenceInYears } from "date-fns";
import MomentDetailsDialog from "./moments/MomentDetailsDialog";
import TimeUnit from "./moments/TimeUnit";

interface ElapsedTimeDisplayProps {
  title: string;
  startDate: Date;
  onClick?: () => void;
  onEdit?: (id: number) => void;
  onStop?: (e: React.MouseEvent) => void;
  id?: number;
  location?: string;
  description?: string;
  note?: string;
}

const ElapsedTimeDisplay: React.FC<ElapsedTimeDisplayProps> = ({
  title,
  startDate,
  onClick,
  onEdit,
  onStop,
  id,
  location,
  description,
  note
}) => {
  const [elapsed, setElapsed] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const calculateElapsed = () => {
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      const years = differenceInYears(now, startDate);
      
      const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setElapsed({ years, days, hours, minutes, seconds });
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit && id !== undefined) {
      onEdit(id);
    }
  };

  return (
    <>
      <div 
        onClick={() => setShowDetails(true)}
        className="w-full text-left p-6 bg-[#161213]/90 border border-[#e8c28244] rounded-lg 
          hover:bg-[#161213] transition-all duration-300 group relative overflow-hidden
          shadow-[0_0_20px_0_#e8c28215] hover:shadow-[0_0_30px_0_#e8c28225]
          cursor-pointer backdrop-blur-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#e8c28205] to-transparent 
          translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-[#e8c282] w-5 h-5" />
            <span className="text-[#e8c282] tracking-[0.25em] font-serif uppercase text-sm font-semibold">{title}</span>
          </div>
          
          <div className="inline-flex items-baseline gap-6 text-[#edd6ae]">
            {elapsed.years > 0 && (
              <TimeUnit value={elapsed.years} unit="years" />
            )}
            <TimeUnit value={elapsed.days} unit="days" />
            <TimeUnit value={elapsed.hours} unit="hours" />
            <TimeUnit value={elapsed.minutes} unit="minutes" />
            <TimeUnit value={elapsed.seconds} unit="seconds" />
          </div>
        </div>
      </div>

      <MomentDetailsDialog
        showDetails={showDetails}
        setShowDetails={setShowDetails}
        title={title}
        startDate={startDate}
        location={location}
        note={note}
        elapsed={elapsed}
        onEdit={id !== undefined && onEdit ? (e) => handleEdit(e) : undefined}
      />
    </>
  );
};

export default ElapsedTimeDisplay;
