
import React from "react";
import { useMoment } from "@/contexts/MomentContext";
import ElapsedTimeDisplay from "@/components/ElapsedTimeDisplay";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar, MapPin } from "lucide-react";

export const MomentsSection = () => {
  const { moments, updateMoment, deleteMoment } = useMoment();
  const [editingMoment, setEditingMoment] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const { toast } = useToast();

  const handleEdit = (id: number) => {
    const moment = moments.find(m => m.id === id);
    if (moment) {
      setEditingMoment(id);
      setEditTitle(moment.title);
      
      // Format the date to match the input type="date" format (YYYY-MM-DD)
      setEditDate(format(new Date(moment.startDate), "yyyy-MM-dd"));
      
      // Format the time to match the input type="time" format (HH:MM)
      setEditTime(format(new Date(moment.startDate), "HH:mm"));
      
      // Set location if it exists
      setEditLocation(moment.location || "");
    }
  };

  const handleSave = () => {
    if (!editTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your moment",
        variant: "destructive",
      });
      return;
    }

    if (!editDate) {
      toast({
        title: "Date required",
        description: "Please enter a start date",
        variant: "destructive",
      });
      return;
    }

    const momentToUpdate = moments.find(m => m.id === editingMoment);
    if (momentToUpdate) {
      // Create a new date object from the date and time inputs
      const [year, month, day] = editDate.split('-').map(Number);
      const [hours, minutes] = editTime ? editTime.split(':').map(Number) : [0, 0];
      
      const updatedDate = new Date(year, month - 1, day, hours, minutes);
      
      updateMoment({
        ...momentToUpdate,
        title: editTitle,
        startDate: updatedDate,
        location: editLocation.trim() || undefined,
      });
      
      toast({
        title: "Moment updated",
        description: "Your moment has been updated successfully",
      });
    }

    setEditingMoment(null);
  };

  const handleCancel = () => {
    setEditingMoment(null);
  };

  const handleDeleteMoment = () => {
    if (editingMoment !== null) {
      deleteMoment(editingMoment);
      setEditingMoment(null);
      toast({
        title: "Moment deleted",
        description: "Your moment has been removed",
      });
    }
  };

  return (
    <div className="space-y-6">
      {moments.map((moment) => (
        <div key={moment.id}>
          <ElapsedTimeDisplay
            id={moment.id}
            title={moment.title}
            startDate={moment.startDate}
            location={moment.location}
            description={moment.description}
            onEdit={handleEdit}
          />
        </div>
      ))}

      <Dialog open={editingMoment !== null} onOpenChange={(open) => {
        if (!open) handleCancel();
      }}>
        <DialogContent className="bg-[#1a1f2c] border border-[#e8c28233] text-[#edd6ae]">
          <DialogHeader>
            <DialogTitle className="text-[#edd6ae] text-center text-xl tracking-wide lowercase">Edit Moment</DialogTitle>
            <DialogDescription className="text-center text-[#e8c28288]">
              Make changes to your moment details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-[#e8c282] block mb-2 tracking-wider lowercase">Title</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="bg-[#e8c28208] border-[#e8c28233] text-[#edd6ae]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#e8c282] block mb-2 tracking-wider lowercase">Start Date</label>
              <Input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="bg-[#e8c28208] border-[#e8c28233] text-[#edd6ae]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#e8c282] block mb-2 tracking-wider lowercase">Time</label>
              <Input
                type="time"
                value={editTime}
                onChange={(e) => setEditTime(e.target.value)}
                className="bg-[#e8c28208] border-[#e8c28233] text-[#edd6ae]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#e8c282] block mb-2 tracking-wider lowercase">
                Location <span className="text-[#e8c28277]">(optional)</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-[#e8c28215] border border-r-0 border-[#e8c28233] rounded-l-md">
                  <MapPin className="h-4 w-4 text-[#e8c282]" />
                </span>
                <Input
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="bg-[#e8c28208] border-[#e8c28233] text-[#edd6ae] rounded-l-none"
                  placeholder="Enter location"
                />
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-3 mt-6">
              {/* Delete button for non-predefined moments */}
              {editingMoment !== null && moments.find(m => m.id === editingMoment)?.isPredefined !== true && (
                <Button
                  onClick={handleDeleteMoment}
                  variant="destructive"
                  className="w-full sm:w-auto"
                >
                  Delete
                </Button>
              )}
              <div className="flex-1 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="w-full bg-transparent border-[#e8c28233] text-[#edd6ae] hover:bg-[#e8c28215]"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="w-full bg-[#e8c282] text-[#1a1f2c] hover:bg-[#edd6ae]"
                >
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
