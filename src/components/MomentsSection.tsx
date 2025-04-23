
import React, { useState } from "react";
import { useMoment } from "@/contexts/MomentContext";
import ElapsedTimeDisplay from "@/components/ElapsedTimeDisplay";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const MomentsSection = () => {
  const { moments, updateMoment, moveMomentUp, moveMomentDown } = useMoment();
  const [editingMoment, setEditingMoment] = useState<any>(null);
  const { toast } = useToast();

  const handleEditSave = () => {
    if (editingMoment) {
      updateMoment(editingMoment);
      setEditingMoment(null);
      toast({
        title: "Changes saved",
        description: "Your moment has been updated successfully.",
      });
    }
  };

  return (
    <div className="space-y-6">
      {moments.map((moment, index) => (
        <div key={moment.id}>
          <ElapsedTimeDisplay
            id={moment.id}
            title={moment.title}
            startDate={moment.startDate}
            location={moment.location}
            note={moment.note}
            onEdit={(id) => setEditingMoment(moments.find(m => m.id === id))}
            onMoveUp={index > 0 ? () => moveMomentUp(moment.id) : undefined}
            onMoveDown={index < moments.length - 1 ? () => moveMomentDown(moment.id) : undefined}
          />
        </div>
      ))}

      <Sheet open={!!editingMoment} onOpenChange={(open) => !open && setEditingMoment(null)}>
        <SheetContent className="bg-[#161213] border-l border-[#e8c28244]">
          <SheetHeader>
            <SheetTitle className="text-[#e8c282] text-center">Edit Moment</SheetTitle>
          </SheetHeader>
          {editingMoment && (
            <div className="space-y-6 mt-8">
              <div>
                <label className="text-[#e8c282]/60 text-sm block mb-2">Title</label>
                <Input
                  value={editingMoment.title}
                  onChange={(e) => setEditingMoment({...editingMoment, title: e.target.value})}
                  className="bg-[#161213] border-[#e8c28244] text-[#e8c282]"
                />
              </div>
              <div>
                <label className="text-[#e8c282]/60 text-sm block mb-2">Location</label>
                <Input
                  value={editingMoment.location || ""}
                  onChange={(e) => setEditingMoment({...editingMoment, location: e.target.value})}
                  className="bg-[#161213] border-[#e8c28244] text-[#e8c282]"
                />
              </div>
              <div>
                <label className="text-[#e8c282]/60 text-sm block mb-2">Memories</label>
                <Input
                  value={editingMoment.note || ""}
                  onChange={(e) => setEditingMoment({...editingMoment, note: e.target.value})}
                  className="bg-[#161213] border-[#e8c28244] text-[#e8c282]"
                />
              </div>
              <Button 
                onClick={handleEditSave}
                className="w-full bg-[#e8c282] text-[#161213] hover:bg-[#e8c282]/90"
              >
                Save Changes
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
