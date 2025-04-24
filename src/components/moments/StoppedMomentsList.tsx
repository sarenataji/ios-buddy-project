
import React, { useState } from "react";
import { format, formatDistanceStrict } from "date-fns";
import { Clock, Calendar, MapPin, StickyNote, CheckCircle } from "lucide-react";
import MomentDetailsDialog from "./MomentDetailsDialog";

interface StoppedMoment {
  id: number;
  title: string;
  startDate: Date;
  stoppedAt?: Date;
  location?: string;
  description?: string;
  note?: string;
}

interface StoppedMomentsListProps {
  moments: StoppedMoment[];
}

const StoppedMomentsList: React.FC<StoppedMomentsListProps> = ({ moments }) => {
  const [selectedMoment, setSelectedMoment] = useState<StoppedMoment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  if (moments.length === 0) {
    return (
      <div className="mt-12 border-t border-[#e8c28233] pt-8">
        <h2 className="text-[#e8c282] tracking-[0.25em] font-serif uppercase text-sm font-semibold mb-6 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Completed Moments
        </h2>
        <p className="text-[#e8c28288] italic text-center py-4">You have no completed moments yet.</p>
      </div>
    );
  }

  const handleMomentClick = (moment: StoppedMoment) => {
    setSelectedMoment(moment);
    setShowDetails(true);
  };

  const calculateElapsedTime = (startDate: Date, endDate: Date) => {
    const diffMs = endDate.getTime() - startDate.getTime();
    
    const seconds = Math.floor((diffMs / 1000) % 60);
    const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
    const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const days = Math.floor((diffMs / (1000 * 60 * 60 * 24)) % 365);
    const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));
    
    return { years, days, hours, minutes, seconds };
  };

  return (
    <div className="mt-12 border-t border-[#e8c28233] pt-8">
      <h2 className="text-[#e8c282] tracking-[0.25em] font-serif uppercase text-sm font-semibold mb-6 flex items-center gap-2">
        <CheckCircle className="w-5 h-5" />
        Completed Moments
      </h2>
      <div className="space-y-4">
        {moments.map((moment) => {
          const duration = moment.stoppedAt 
            ? formatDistanceStrict(moment.stoppedAt, moment.startDate)
            : "Unknown duration";

          return (
            <div
              key={moment.id}
              className="p-6 bg-[#161213]/90 border border-[#e8c28244] rounded-lg
                hover:bg-[#161213] transition-all duration-300
                shadow-[0_0_20px_0_#e8c28215] hover:shadow-[0_0_30px_0_#e8c28225]
                cursor-pointer"
              onClick={() => handleMomentClick(moment)}
            >
              <div className="flex flex-col gap-3">
                <h3 className="text-[#edd6ae] text-xl font-serif">{moment.title}</h3>
                
                <div className="grid gap-2 text-sm text-[#e8c28288]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Started: {format(moment.startDate, "PPP 'at' p")}</span>
                  </div>
                  
                  {moment.stoppedAt && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        Completed: {format(moment.stoppedAt, "PPP 'at' p")}
                        <span className="ml-2 text-[#e8c28255]">({duration})</span>
                      </span>
                    </div>
                  )}
                  
                  {moment.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{moment.location}</span>
                    </div>
                  )}
                </div>
                
                {moment.note && (
                  <div className="mt-2 pt-3 border-t border-[#e8c28222]">
                    <div className="flex items-start gap-2 text-sm text-[#e8c28288]">
                      <StickyNote className="w-4 h-4 mt-0.5" />
                      <p className="whitespace-pre-wrap line-clamp-2">{moment.note}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedMoment && (
        <MomentDetailsDialog
          showDetails={showDetails}
          setShowDetails={setShowDetails}
          title={selectedMoment.title}
          startDate={selectedMoment.startDate}
          location={selectedMoment.location}
          note={selectedMoment.note}
          elapsed={selectedMoment.stoppedAt ? 
            calculateElapsedTime(selectedMoment.startDate, selectedMoment.stoppedAt) : 
            { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
          }
          stoppedAt={selectedMoment.stoppedAt}
        />
      )}
    </div>
  );
};

export default StoppedMomentsList;
