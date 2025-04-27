
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFace } from '@/hooks/useFace';
import MoodFace from './MoodFace';

const MonthView = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showDetails, setShowDetails] = useState(false);
  const { getReflectionsByDate } = useFace();

  const selectedReflections = selectedDate ? getReflectionsByDate(selectedDate) : [];

  const renderDayContent = (day: Date) => {
    const reflections = getReflectionsByDate(day);
    if (reflections.length === 0) return null;

    const lastMood = reflections[reflections.length - 1];
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-8 h-8">
          <MoodFace 
            mood={lastMood.mood} 
            moodValue={lastMood.index} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-6 p-4">
      <div className="flex-1">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            setSelectedDate(date);
            if (date) {
              const reflections = getReflectionsByDate(date);
              if (reflections.length > 0) {
                setShowDetails(true);
              }
            }
          }}
          className="rounded-md border border-[#e8c28233] bg-[#1a0c05]/50"
          components={{
            DayContent: ({ date }) => (
              <div className="relative w-full h-full min-h-[32px]">
                <div className="absolute inset-0 flex items-center justify-center">
                  {date.getDate()}
                </div>
                {renderDayContent(date)}
              </div>
            ),
          }}
        />
      </div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-[#0c0a08] border-[#e8c28233] text-[#e8c282]">
          <DialogHeader>
            <DialogTitle className="font-serif">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Reflections'}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {selectedReflections.map((reflection, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg bg-[#1a0c05]/70 border border-[#e8c28233]"
                >
                  <div className="w-12 h-12">
                    <MoodFace 
                      mood={reflection.mood} 
                      moodValue={reflection.index}
                    />
                  </div>
                  <div>
                    <p className="font-serif text-lg">{reflection.mood}</p>
                    <p className="text-sm text-[#e8c282]/70">
                      {format(reflection.timestamp, 'h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MonthView;
