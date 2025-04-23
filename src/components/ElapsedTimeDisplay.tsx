import React, { useState, useEffect } from "react";
import { Clock, Calendar, MapPin, StickyNote, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format, differenceInYears, isThisYear } from "date-fns";
import { Button } from "@/components/ui/button";

interface ElapsedTimeDisplayProps {
  title: string;
  startDate: Date;
  onClick?: () => void;
  onEdit?: (id: number) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
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
  onMoveUp,
  onMoveDown,
  id,
  location,
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
        className="relative w-full text-left p-6 bg-[#161213]/90 border border-[#e8c28244] rounded-lg 
          hover:bg-[#161213] transition-all duration-300
          shadow-[0_0_20px_0_#e8c28215] hover:shadow-[0_0_30px_0_#e8c28225]
          cursor-pointer group"
      >
        <div className="flex items-center gap-4 mb-6">
          <Clock className="w-5 h-5 text-[#e8c282]" />
          <div className="text-lg text-[#e8c282] tracking-[0.25em] font-serif uppercase">{title}</div>
        </div>

        <div className="grid grid-cols-5 gap-4 text-center">
          {elapsed.years > 0 && (
            <TimeUnit value={elapsed.years} unit="years" />
          )}
          <TimeUnit value={elapsed.days} unit="days" />
          <TimeUnit value={elapsed.hours} unit="hours" />
          <TimeUnit value={elapsed.minutes} unit="minutes" />
          <TimeUnit value={elapsed.seconds} unit="seconds" />
        </div>

        {(onMoveUp || onMoveDown) && (
          <div className="absolute top-4 right-4 flex gap-2">
            {onMoveUp && (
              <Button
                onClick={(e) => { e.stopPropagation(); onMoveUp(); }}
                variant="ghost"
                size="icon"
                className="opacity-50 hover:opacity-100 hover:bg-[#e8c28215]"
              >
                <Pencil className="h-4 w-4 text-[#e8c282]" />
              </Button>
            )}
          </div>
        )}

        {onEdit && id !== undefined && (
          <button
            onClick={handleEdit}
            className="absolute top-4 right-4 p-2 opacity-70 hover:opacity-100"
          >
            <Pencil className="h-4 w-4 text-[#e8c282]" />
          </button>
        )}
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-[#161213] border-0 p-8 rounded-2xl overflow-hidden max-w-md">
          <div className="space-y-8">
            <div className="text-center text-2xl text-[#e8c282] font-serif tracking-wide mb-8">
              Moment Details
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="text-[#e8c282]/60 lowercase tracking-wider text-sm">title</div>
                <div className="text-[#e8c282] text-3xl font-serif">{title}</div>
              </div>

              <div className="space-y-2">
                <div className="text-[#e8c282]/60 lowercase tracking-wider text-sm">start date & time</div>
                <div className="flex items-center gap-2 text-[#e8c282]">
                  <Calendar className="w-5 h-5 opacity-70" />
                  <span>{format(startDate, "MMMM d, yyyy 'at' h:mm a")}</span>
                </div>
              </div>

              {location && (
                <div className="space-y-2">
                  <div className="text-[#e8c282]/60 lowercase tracking-wider text-sm">location</div>
                  <div className="flex items-center gap-2 text-[#e8c282]">
                    <MapPin className="w-5 h-5 opacity-70" />
                    <span>{location}</span>
                  </div>
                </div>
              )}

              {note && (
                <div className="space-y-2">
                  <div className="text-[#e8c282]/60 lowercase tracking-wider text-sm">memories</div>
                  <div className="flex items-start gap-2 text-[#e8c282]">
                    <StickyNote className="w-5 h-5 opacity-70 mt-1" />
                    <span>{note}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-5 gap-4 text-center py-6">
                {elapsed.years > 0 && (
                  <TimeUnit value={elapsed.years} unit="years" size="large" />
                )}
                <TimeUnit value={elapsed.days} unit="days" size="large" />
                <TimeUnit value={elapsed.hours} unit="hours" size="large" />
                <TimeUnit value={elapsed.minutes} unit="minutes" size="large" />
                <TimeUnit value={elapsed.seconds} unit="seconds" size="large" />
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleEdit}
                  className="bg-[#292524] hover:bg-[#292524]/80 text-[#e8c282] border-none px-6 py-5 text-lg rounded-xl"
                >
                  <Pencil className="w-5 h-5 mr-2" />
                  Edit this moment
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface TimeUnitProps {
  value: number;
  unit: string;
  size?: 'normal' | 'large';
}

const TimeUnit = ({ value, unit, size = 'normal' }: TimeUnitProps) => (
  <div className="text-center">
    <div className={`font-serif font-bold text-[#e8c282] ${size === 'large' ? 'text-4xl' : 'text-2xl'}`}>
      {value.toString().padStart(2, '0')}
    </div>
    <div className={`uppercase tracking-wider text-[#e8c282]/40 ${size === 'large' ? 'text-sm' : 'text-xs'}`}>
      {unit}
    </div>
  </div>
);

export default ElapsedTimeDisplay;
