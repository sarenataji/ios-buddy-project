
import React from "react";
import { format } from "date-fns";
import { Clock, Calendar, MapPin } from "lucide-react";

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
  if (moments.length === 0) return null;

  return (
    <div className="mt-12 border-t border-[#e8c28233] pt-8">
      <h2 className="text-[#e8c282] tracking-[0.25em] font-serif uppercase text-sm font-semibold mb-6">
        Completed Moments
      </h2>
      <div className="space-y-4">
        {moments.map((moment) => (
          <div
            key={moment.id}
            className="p-4 bg-[#161213]/90 border border-[#e8c28244] rounded-lg"
          >
            <div className="flex flex-col gap-2">
              <h3 className="text-[#edd6ae] text-lg font-serif">{moment.title}</h3>
              
              <div className="flex items-center gap-2 text-sm text-[#e8c28288]">
                <Calendar className="w-4 h-4" />
                <span>Started: {format(moment.startDate, "PPP")}</span>
              </div>
              
              {moment.stoppedAt && (
                <div className="flex items-center gap-2 text-sm text-[#e8c28288]">
                  <Clock className="w-4 h-4" />
                  <span>Completed: {format(moment.stoppedAt, "PPP 'at' p")}</span>
                </div>
              )}
              
              {moment.location && (
                <div className="flex items-center gap-2 text-sm text-[#e8c28288]">
                  <MapPin className="w-4 h-4" />
                  <span>{moment.location}</span>
                </div>
              )}
              
              {moment.note && (
                <p className="text-sm text-[#e8c28288] mt-2 whitespace-pre-wrap">
                  {moment.note}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoppedMomentsList;
