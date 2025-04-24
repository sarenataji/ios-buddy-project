
import React, { useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import CountdownTimer from "./CountdownTimer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const CountdownList = () => {
  const { countdowns, completeCountdown, updateCountdown, deleteCountdown } = useCountdown();
  const [editingCountdown, setEditingCountdown] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState<Date | undefined>();
  const [editLocation, setEditLocation] = useState("");
  const [editNote, setEditNote] = useState("");
  const { toast } = useToast();
  
  const activeCountdowns = countdowns.filter(c => !c.isCompleted);

  const handleEdit = (countdown: any) => {
    setEditingCountdown(countdown.id);
    setEditTitle(countdown.title);
    setEditDate(new Date(countdown.endDate));
    setEditLocation(countdown.location || "");
    setEditNote(countdown.note || "");
  };

  const handleSave = () => {
    if (!editingCountdown || !editTitle.trim() || !editDate) {
      toast({
        title: "Invalid input",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const countdown = countdowns.find(c => c.id === editingCountdown);
    if (countdown) {
      updateCountdown({
        ...countdown,
        title: editTitle,
        endDate: editDate,
        location: editLocation.trim() || undefined,
        note: editNote.trim() || undefined,
      });

      toast({
        title: "Countdown updated",
        description: "Your countdown has been updated successfully",
      });
    }

    setEditingCountdown(null);
  };

  const handleDelete = () => {
    if (editingCountdown) {
      deleteCountdown(editingCountdown);
      setEditingCountdown(null);
      toast({
        title: "Countdown deleted",
        description: "Your countdown has been removed",
      });
    }
  };

  if (activeCountdowns.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-[#e8c282] tracking-[0.25em] font-serif uppercase text-sm font-semibold mb-6">
        Active Countdowns
      </h2>
      {activeCountdowns.map((countdown) => (
        <div
          key={countdown.id}
          onClick={() => handleEdit(countdown)}
          className="bg-[#1a0c05] rounded-xl p-6 space-y-4 border border-[#e8c28233] cursor-pointer hover:border-[#e8c28266] transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[#edd6ae] text-lg font-medium mb-1">{countdown.title}</h3>
              {countdown.location && (
                <p className="text-[#e8c282aa] text-sm">{countdown.location}</p>
              )}
            </div>
          </div>
          <CountdownTimer 
            targetDate={countdown.endDate} 
            onComplete={() => completeCountdown(countdown.id)}
          />
          {countdown.note && (
            <p className="text-[#e8c282aa] text-sm mt-4">{countdown.note}</p>
          )}
        </div>
      ))}

      <Dialog open={editingCountdown !== null} onOpenChange={() => setEditingCountdown(null)}>
        <DialogContent className="bg-[#1a0c05] border-[#e8c28233] text-[#edd6ae]">
          <DialogHeader>
            <DialogTitle className="text-[#edd6ae] text-center text-xl tracking-wide lowercase">
              Edit Countdown
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="bg-[#140d07] border-[#e8c28233]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Calendar
                mode="single"
                selected={editDate}
                onSelect={setEditDate}
                className="bg-[#1a0c05] text-[#edd6ae] rounded-md border border-[#e8c28233]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Location</label>
              <Input
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
                className="bg-[#140d07] border-[#e8c28233]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Note</label>
              <Input
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                className="bg-[#140d07] border-[#e8c28233]"
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="bg-red-900 hover:bg-red-800 text-[#edd6ae]"
              >
                Delete
              </Button>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingCountdown(null)}
                  className="border-[#e8c28233] text-[#edd6ae] hover:bg-[#e8c28222]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-[#e8c282] text-[#1a0c05] hover:bg-[#edd6ae]"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CountdownList;
