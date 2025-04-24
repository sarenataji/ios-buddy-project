
import React from "react";
import { format, formatDistanceStrict } from "date-fns";
import { Clock, Calendar, MapPin, StickyNote, CheckCircle } from "lucide-react";

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
                shadow-[0_0_20px_0_#e8c28215] hover:shadow-[0_0_30px_0_#e8c28225]"
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
                      <p className="whitespace-pre-wrap">{moment.note}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoppedMomentsList;
