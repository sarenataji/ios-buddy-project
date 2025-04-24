
import React from "react";
import { Calendar, Info, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import TimeUnit from "./TimeUnit";

interface CountdownDetailsDialogProps {
  countdown: {
    id: number;
    title: string;
    startDate: Date;
    endDate: Date;
    location?: string;
    note?: string;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

const CountdownDetailsDialog = ({
  countdown,
  isOpen,
  onClose,
  onEdit,
}: CountdownDetailsDialogProps) => {
  if (!countdown) return null;

  // Calculate time remaining
  const now = new Date();
  const difference = countdown.endDate.getTime() - now.getTime();
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[90vh] w-[90%] max-w-lg
        bg-[#161213] border border-[#e8c28244] text-[#edd6ae] rounded-xl
        shadow-[0_8px_32px_rgba(232,194,130,0.2)]">
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-[#edd6ae] text-center text-2xl tracking-wide font-serif">
            <Info className="w-5 h-5 inline-block mr-2 opacity-80" />
            Countdown Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="space-y-2 bg-[#e8c28208] p-4 rounded-lg backdrop-blur-sm border border-[#e8c28222]">
            <div className="text-sm font-medium text-[#e8c28288] tracking-wider lowercase">Title</div>
            <div className="text-xl font-serif tracking-wide text-[#edd6ae]">{countdown.title}</div>
          </div>
          
          <div className="space-y-2 bg-[#e8c28208] p-4 rounded-lg backdrop-blur-sm border border-[#e8c28222]">
            <div className="text-sm font-medium text-[#e8c28288] tracking-wider lowercase">Timeline</div>
            <div className="flex items-center gap-2 text-[#edd6ae]">
              <Calendar className="w-4 h-4 opacity-70" />
              <span>
                {format(countdown.startDate, "MMMM d, yyyy")} - {format(countdown.endDate, "MMMM d, yyyy")}
              </span>
            </div>
          </div>

          {countdown.location && (
            <div className="space-y-2 bg-[#e8c28208] p-4 rounded-lg backdrop-blur-sm border border-[#e8c28222]">
              <div className="text-sm font-medium text-[#e8c28288] tracking-wider lowercase">Location</div>
              <div className="flex items-center gap-2 text-[#edd6ae]">
                <MapPin className="w-4 h-4 opacity-70" />
                <span>{countdown.location}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="text-[#e8c282] text-sm mb-2 font-serif">Time remaining:</div>
            <div className="grid grid-cols-4 gap-4">
              <TimeUnit value={days} unit="Days" />
              <TimeUnit value={hours} unit="Hours" />
              <TimeUnit value={minutes} unit="Minutes" />
              <TimeUnit value={seconds} unit="Seconds" />
            </div>
          </div>

          <div className="mt-6">
            <Button
              onClick={onEdit}
              className="w-full bg-[#e8c282] text-[#1a0c05] hover:bg-[#edd6ae]"
            >
              Edit Countdown
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CountdownDetailsDialog;
