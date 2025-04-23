
import React, { useState } from "react";
import { useMoment } from "@/contexts/MomentContext";
import ElapsedTimeDisplay from "@/components/ElapsedTimeDisplay";
import { Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const Moments = () => {
  const { moments, addMoment } = useMoment();
  const [isAddingMoment, setIsAddingMoment] = useState(false);
  const [newMomentTitle, setNewMomentTitle] = useState("");
  const { toast } = useToast();

  const predefinedMoments = moments.filter(m => m.isPredefined);
  const customMoments = moments.filter(m => !m.isPredefined);

  const handleAddMoment = () => {
    if (!newMomentTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your moment",
        variant: "destructive",
      });
      return;
    }

    addMoment({
      title: newMomentTitle,
      startDate: new Date(),
    });

    setNewMomentTitle("");
    setIsAddingMoment(false);
    
    toast({
      title: "Moment added",
      description: "Your new moment has been created",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-[#edd6ae]">Moments</h1>
          <Button
            onClick={() => setIsAddingMoment(true)}
            className="bg-[#e8c282] text-[#1a1f2c] hover:bg-[#edd6ae]"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {predefinedMoments.length > 0 && (
          <>
            <h2 className="text-[#e8c282] text-lg font-medium mb-4">Life Events</h2>
            <div className="space-y-4 mb-8">
              {predefinedMoments.map((moment) => (
                <ElapsedTimeDisplay
                  key={moment.id}
                  title={moment.title}
                  startDate={moment.startDate}
                />
              ))}
            </div>
          </>
        )}

        {customMoments.length > 0 && (
          <>
            <h2 className="text-[#e8c282] text-lg font-medium mb-4">Custom Moments</h2>
            <div className="space-y-4">
              {customMoments.map((moment) => (
                <ElapsedTimeDisplay
                  key={moment.id}
                  title={moment.title}
                  startDate={moment.startDate}
                />
              ))}
            </div>
          </>
        )}

        <Sheet open={isAddingMoment} onOpenChange={setIsAddingMoment}>
          <SheetContent className="bg-[#1a1f2c] border-l border-[#e8c28233] text-[#edd6ae]">
            <SheetHeader>
              <SheetTitle className="text-[#edd6ae]">Add New Moment</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#e8c282]">Title</label>
                <Input
                  value={newMomentTitle}
                  onChange={(e) => setNewMomentTitle(e.target.value)}
                  placeholder="Enter moment title"
                  className="bg-[#161213] border-[#e8c28244] text-[#edd6ae]"
                />
              </div>
              <Button
                onClick={handleAddMoment}
                className="w-full bg-[#e8c282] text-[#1a1f2c] hover:bg-[#edd6ae]"
              >
                Add Moment
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Moments;
