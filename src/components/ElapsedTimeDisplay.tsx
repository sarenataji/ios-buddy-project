
import React, { useState, useEffect } from "react";
import { Clock, Pencil, Calendar, MapPin, Info, StickyNote } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, isThisYear, differenceInYears } from "date-fns";

interface ElapsedTimeDisplayProps {
  title: string;
  startDate: Date;
  onClick?: () => void;
  onEdit?: (id: number) => void;
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
        
        {onEdit && id !== undefined && (
          <button
            onClick={handleEdit}
            className="absolute top-6 right-6 p-2 opacity-70 group-hover:opacity-100 
              transition-opacity duration-300 rounded-full 
              bg-[#e8c28215] hover:bg-[#e8c28222]"
            aria-label="Edit moment"
          >
            <Pencil className="w-4 h-4 text-[#e8c282]" />
          </button>
        )}
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[90vh] w-[90%] max-w-lg
          bg-[#161213] border border-[#e8c28244] text-[#edd6ae] rounded-xl
          shadow-[0_8px_32px_rgba(232,194,130,0.2)] overflow-auto">
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-[#edd6ae] text-center text-2xl tracking-wide font-serif">
              <Info className="w-5 h-5 inline-block mr-2 opacity-80" />
              Moment Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="relative z-10 mt-6 space-y-6">
            <div className="space-y-2 bg-[#e8c28208] p-4 rounded-lg backdrop-blur-sm border border-[#e8c28222]">
              <div className="text-sm font-medium text-[#e8c28288] tracking-wider lowercase">Title</div>
              <div className="text-xl font-serif tracking-wide text-[#edd6ae]">{title}</div>
            </div>
            
            <div className="space-y-2 bg-[#e8c28208] p-4 rounded-lg backdrop-blur-sm border border-[#e8c28222]">
              <div className="text-sm font-medium text-[#e8c28288] tracking-wider lowercase">Start Date & Time</div>
              <div className="flex items-center gap-2 text-[#edd6ae]">
                <Calendar className="w-4 h-4 opacity-70" />
                <span>
                  {format(startDate, "MMMM d, yyyy 'at' p")}
                </span>
              </div>
            </div>

            {location && (
              <div className="space-y-2 bg-[#e8c28208] p-4 rounded-lg backdrop-blur-sm border border-[#e8c28222]">
                <div className="text-sm font-medium text-[#e8c28288] tracking-wider lowercase">Location</div>
                <div className="flex items-center gap-2 text-[#edd6ae]">
                  <MapPin className="w-4 h-4 opacity-70" />
                  <span>{location}</span>
                </div>
              </div>
            )}

            {note && (
              <div className="space-y-2 bg-[#e8c28208] p-4 rounded-lg backdrop-blur-sm border border-[#e8c28222]">
                <div className="text-sm font-medium text-[#e8c28288] tracking-wider lowercase">Memories</div>
                <div className="flex items-start gap-2 text-[#edd6ae]">
                  <StickyNote className="w-4 h-4 opacity-70 mt-1" />
                  <span className="whitespace-pre-wrap">{note}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-5 gap-2">
              {elapsed.years > 0 && (
                <div className="space-y-1 bg-[#e8c28208] p-3 rounded-lg text-center backdrop-blur-sm border border-[#e8c28222]">
                  <div className="text-2xl font-serif font-bold text-[#edd6ae]">
                    {elapsed.years.toString().padStart(2, '0')}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-[#e8c28288]">
                    Years
                  </div>
                </div>
              )}
              <div className="space-y-1 bg-[#e8c28208] p-3 rounded-lg text-center backdrop-blur-sm border border-[#e8c28222]">
                <div className="text-2xl font-serif font-bold text-[#edd6ae]">
                  {elapsed.days.toString().padStart(2, '0')}
                </div>
                <div className="text-xs uppercase tracking-wider text-[#e8c28288]">
                  Days
                </div>
              </div>
              <div className="space-y-1 bg-[#e8c28208] p-3 rounded-lg text-center backdrop-blur-sm border border-[#e8c28222]">
                <div className="text-2xl font-serif font-bold text-[#edd6ae]">
                  {elapsed.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-xs uppercase tracking-wider text-[#e8c28288]">
                  Hours
                </div>
              </div>
              <div className="space-y-1 bg-[#e8c28208] p-3 rounded-lg text-center backdrop-blur-sm border border-[#e8c28222]">
                <div className="text-2xl font-serif font-bold text-[#edd6ae]">
                  {elapsed.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-xs uppercase tracking-wider text-[#e8c28288]">
                  Minutes
                </div>
              </div>
              <div className="space-y-1 bg-[#e8c28208] p-3 rounded-lg text-center backdrop-blur-sm border border-[#e8c28222]">
                <div className="text-2xl font-serif font-bold text-[#edd6ae]">
                  {elapsed.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-xs uppercase tracking-wider text-[#e8c28288]">
                  Seconds
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              {onEdit && id !== undefined && (
                <button
                  onClick={(e) => {
                    setShowDetails(false);
                    handleEdit(e);
                  }}
                  className="px-4 py-2 bg-[#e8c28222] hover:bg-[#e8c28233] rounded-md text-[#e8c282] 
                    transition-colors duration-300 inline-flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  Edit this moment
                </button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const TimeUnit = ({ value, unit }: { value: number; unit: string }) => (
  <div className="flex flex-col items-center">
    <span className="text-3xl font-serif font-bold tracking-tight">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-xs uppercase tracking-wider text-[#e8c28288] mt-1">
      {unit}
    </span>
  </div>
);

export default ElapsedTimeDisplay;
