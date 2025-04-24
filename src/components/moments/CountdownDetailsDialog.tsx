
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CountdownDetailsDialogProps {
  countdown: {
    id: number;
    title: string;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#140D07] border-[#e8c28233] text-[#edd6ae]">
        <DialogHeader>
          <DialogTitle className="text-[#edd6ae] text-center text-xl tracking-wide font-serif">
            {countdown.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {countdown.location && (
            <div>
              <h4 className="text-[#e8c282] text-sm font-medium mb-1">Location</h4>
              <p className="text-[#edd6ae]">{countdown.location}</p>
            </div>
          )}
          
          {countdown.note && (
            <div>
              <h4 className="text-[#e8c282] text-sm font-medium mb-1">Note</h4>
              <p className="text-[#edd6ae]">{countdown.note}</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <Button
            onClick={onEdit}
            className="w-full bg-[#e8c282] text-[#1a0c05] hover:bg-[#edd6ae]"
          >
            Edit Countdown
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CountdownDetailsDialog;
