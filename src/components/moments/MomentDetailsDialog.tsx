
import React from "react";
import { Calendar, Info, MapPin, Pencil, StickyNote } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import TimeUnit from "./TimeUnit";

interface ElapsedTime {
  years: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface MomentDetailsDialogProps {
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;
  title: string;
  startDate: Date;
  location?: string;
  note?: string;
  elapsed: ElapsedTime;
  onEdit?: () => void;
}

const MomentDetailsDialog = ({
  showDetails,
  setShowDetails,
  title,
  startDate,
  location,
  note,
  elapsed,
  onEdit
}: MomentDetailsDialogProps) => {
  return (
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
              <TimeUnit value={elapsed.years} unit="Years" />
            )}
            <TimeUnit value={elapsed.days} unit="Days" />
            <TimeUnit value={elapsed.hours} unit="Hours" />
            <TimeUnit value={elapsed.minutes} unit="Minutes" />
            <TimeUnit value={elapsed.seconds} unit="Seconds" />
          </div>
          
          <div className="mt-4 text-center">
            {onEdit && (
              <button
                onClick={() => {
                  setShowDetails(false);
                  onEdit();
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
  );
};

export default MomentDetailsDialog;
