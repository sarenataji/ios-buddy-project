
import React from "react";
import { useMoment } from "@/contexts/MomentContext";
import ElapsedTimeDisplay from "@/components/ElapsedTimeDisplay";
import { Calendar, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const MomentsSection = () => {
  const { moments, updateMoment } = useMoment();
  const [editingMoment, setEditingMoment] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const { toast } = useToast();

  const handleEdit = (moment: any) => {
    setEditingMoment(moment.id);
    setEditTitle(moment.title);
    setEditDate(new Date(moment.startDate).toISOString().split('T')[0]);
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
      updateMoment({
        ...momentToUpdate,
        title: editTitle,
        startDate: new Date(editDate),
      });
    }

    setEditingMoment(null);
    toast({
      title: "Moment updated",
      description: "Your moment has been updated successfully",
    });
  };

  return (
    <div className="space-y-6">
      {moments.map((moment) => (
        <div key={moment.id} className="group relative">
          <ElapsedTimeDisplay
            title={moment.title}
            startDate={moment.startDate}
          />
          <button
            onClick={() => handleEdit(moment)}
            className="absolute top-6 right-6 p-2 opacity-0 group-hover:opacity-100 
              transition-opacity duration-300 rounded-full 
              bg-[#e8c28215] hover:bg-[#e8c28222]"
          >
            <Edit className="w-4 h-4 text-[#e8c282]" />
          </button>
        </div>
      ))}

      <Dialog open={editingMoment !== null} onOpenChange={() => setEditingMoment(null)}>
        <DialogContent className="bg-[#1a1f2c] border border-[#e8c28233]">
          <DialogHeader>
            <DialogTitle className="text-[#edd6ae] text-center">Edit Moment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium text-[#e8c282] block mb-2">Title</label>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="bg-[#e8c28208] border-[#e8c28233] text-[#edd6ae]"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[#e8c282] block mb-2">Start Date</label>
              <Input
                type="date"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                className="bg-[#e8c28208] border-[#e8c28233] text-[#edd6ae]"
              />
            </div>
            <Button
              onClick={handleSave}
              className="w-full bg-[#e8c282] text-[#1a1f2c] hover:bg-[#edd6ae]"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
