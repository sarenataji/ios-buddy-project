
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format, getDaysInYear, isAfter, isBefore, isSameDay, addDays } from 'date-fns';
import { Calendar } from 'lucide-react';

interface YearVisualizerProps {
  year?: number;
}

const YearVisualizer = ({ year = new Date().getFullYear() }: YearVisualizerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [pointerDown, setPointerDown] = useState(false);
  const today = new Date();

  // Generate all days in the year
  const generateDaysInYear = (year: number) => {
    const daysInYear = getDaysInYear(new Date(year, 0, 1));
    const days: Date[] = [];
    
    for (let i = 0; i < daysInYear; i++) {
      days.push(addDays(new Date(year, 0, 1), i));
    }
    
    return days;
  };

  const daysInYear = generateDaysInYear(year);
  const daysLeft = daysInYear.filter(day => isAfter(day, today)).length;

  // Calculate days per row for UI layout
  const daysPerRow = 15; // This creates a nice grid that fits well on most screens
  const rows = Math.ceil(daysInYear.length / daysPerRow);

  const handlePointerEnter = (day: Date) => {
    if (pointerDown) {
      setHoveredDate(day);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-6 flex items-center justify-center gap-2 px-6 py-2 rounded-xl 
          bg-[#1a1f2c]/90 border border-[#e8c28244] hover:bg-[#1a1f2c] 
          text-[#e8c282] text-sm tracking-wide transition-all duration-200
          shadow-[0_0_15px_0_#e8c28222] hover:shadow-[0_0_20px_0_#e8c28233]"
      >
        <Calendar className="w-4 h-4" />
        <span>Year View</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="bg-[#000000] border-none p-0 max-w-xs max-h-[90vh] overflow-hidden rounded-3xl"
          onPointerDown={() => setPointerDown(true)}
          onPointerUp={() => {
            setPointerDown(false);
            setHoveredDate(null);
          }}
          onPointerLeave={() => {
            setPointerDown(false);
            setHoveredDate(null);
          }}
        >
          <div className="w-full h-full flex flex-col p-4">
            <div 
              className="flex-1 grid gap-2 p-2" 
              style={{ 
                gridTemplateColumns: `repeat(${daysPerRow}, 1fr)`,
                width: '100%',
                aspectRatio: `${daysPerRow}/${rows}`,
                maxHeight: 'calc(90vh - 120px)'
              }}
            >
              {daysInYear.map((day, index) => {
                const isPast = isBefore(day, today) && !isSameDay(day, today);
                const isFuture = isAfter(day, today) || isSameDay(day, today);
                
                return (
                  <div
                    key={index}
                    className={`
                      w-4 h-4 rounded-full transition-colors cursor-pointer
                      ${isPast ? 'bg-[#2a180f]' : 'bg-[#edd6ae]'}
                      ${hoveredDate && isSameDay(hoveredDate, day) ? 'ring-2 ring-[#e8c282]' : ''}
                    `}
                    onPointerEnter={() => handlePointerEnter(day)}
                    onPointerDown={() => {
                      setPointerDown(true);
                      setHoveredDate(day);
                    }}
                  />
                );
              })}
            </div>
            
            <div className="flex justify-between items-center text-[#e8c282] font-mono text-sm mt-8 px-4 pb-4">
              <div>
                {hoveredDate ? format(hoveredDate, "EEEE, MMMM d, yyyy") : year}
              </div>
              <div>
                {daysLeft} days left
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default YearVisualizer;

