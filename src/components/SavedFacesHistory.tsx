
import React, { useState } from 'react';
import { useFace } from '@/hooks/useFace';
import { format } from 'date-fns';
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar as CalendarIcon } from "lucide-react";

const SavedFacesHistory = () => {
  const { savedFaces, getReflectionsByDate } = useFace();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'recent' | 'daily'>('recent');
  
  // Get reflections for selected date
  const dailyReflections = selectedDate ? getReflectionsByDate(selectedDate) : [];
  
  // Calculate dates that have reflections for calendar highlighting
  const datesWithReflections = savedFaces.reduce<Record<string, boolean>>((acc, face) => {
    acc[face.date] = true;
    return acc;
  }, {});
  
  // Group saved faces by date for the list view
  const groupedByDate = savedFaces.reduce<Record<string, typeof savedFaces>>((acc, face) => {
    if (!acc[face.date]) {
      acc[face.date] = [];
    }
    acc[face.date].push(face);
    return acc;
  }, {});

  // Sort dates in descending order (newest first)
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  if (savedFaces.length === 0) {
    return (
      <div className="w-full py-8 text-center text-[#edd6ae]/60">
        <p className="italic font-serif">No face reflections saved yet</p>
      </div>
    );
  }
  
  // Render a face indicator based on mood
  const renderMoodIcon = (mood: string) => {
    return (
      <div className="w-10 h-10 rounded-full bg-[#7e5a39]/60 flex items-center justify-center text-[#e8c282] font-serif text-lg">
        {mood.charAt(0)}
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[#e8c282] font-serif text-xl">Saved Reflections</h3>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsCalendarOpen(true)}
            className="flex items-center gap-1.5 py-1 px-3 rounded-md border border-[#e8c28233] bg-[#1a0c05]/70 text-[#edd6ae] text-sm hover:bg-[#1a0c05]"
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'recent' | 'daily')} className="w-full">
        <TabsList className="bg-[#1a0c05]/50 border border-[#e8c28233]">
          <TabsTrigger value="recent" className="data-[state=active]:bg-[#7e5a39]/40 text-[#edd6ae]">Recent</TabsTrigger>
          <TabsTrigger value="daily" className="data-[state=active]:bg-[#7e5a39]/40 text-[#edd6ae]">
            {selectedDate ? format(selectedDate, 'MMM d') : 'Daily'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="recent" className="pt-2">
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {sortedDates.map(date => (
              <div key={date} className="space-y-2">
                <h4 className="text-[#edd6ae] text-sm font-medium">
                  {format(new Date(date), "EEEE, MMMM d, yyyy")}
                </h4>
                
                {groupedByDate[date].map((face, idx) => (
                  <div 
                    key={`${date}-${idx}`}
                    className="bg-[#1a0c05]/70 border border-[#e8c28233] rounded-lg p-3 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      {renderMoodIcon(face.mood)}
                      <div>
                        <p className="text-[#edd6ae] font-serif">{face.mood}</p>
                        <p className="text-[#edd6ae]/60 text-xs">
                          {format(face.timestamp, "h:mm a")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="daily" className="pt-2">
          {dailyReflections.length > 0 ? (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {dailyReflections.map((face, idx) => (
                <div 
                  key={idx}
                  className="bg-[#1a0c05]/70 border border-[#e8c28233] rounded-lg p-3 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    {renderMoodIcon(face.mood)}
                    <div>
                      <p className="text-[#edd6ae] font-serif">{face.mood}</p>
                      <p className="text-[#edd6ae]/60 text-xs">
                        {format(face.timestamp, "h:mm a")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-[#edd6ae]/60">
              <p className="italic font-serif">No reflections for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'this day'}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Calendar Dialog */}
      <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <DialogContent className="bg-[#0c0a08] border-[#e8c28233] text-[#edd6ae]">
          <DialogHeader>
            <DialogTitle className="text-[#e8c282] font-serif">Select Date</DialogTitle>
          </DialogHeader>
          
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setViewMode('daily');
              setIsCalendarOpen(false);
            }}
            className="p-3 pointer-events-auto bg-[#1a0c05]/50 rounded-lg border border-[#e8c28233] mx-auto"
            modifiers={{
              highlighted: (date) => datesWithReflections[format(date, 'yyyy-MM-dd')] === true
            }}
            modifiersClassNames={{
              highlighted: "bg-[#7e5a39]/30 text-[#e8c282] font-medium"
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedFacesHistory;
