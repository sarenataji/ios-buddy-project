import React, { useState } from "react";
import { useMoment } from "@/contexts/MomentContext";
import { Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { MomentsSection } from "@/components/MomentsSection";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Moments = () => {
  const { addMoment } = useMoment();
  const [isAddingMoment, setIsAddingMoment] = useState(false);
  const [newMomentTitle, setNewMomentTitle] = useState("");
  const [newMomentDate, setNewMomentDate] = useState<Date | undefined>(new Date());
  const [newMomentLocation, setNewMomentLocation] = useState("");
  const [newMomentNote, setNewMomentNote] = useState("");
  const { toast } = useToast();

  const handleAddMoment = () => {
    if (!newMomentTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your moment",
        variant: "destructive",
      });
      return;
    }

    if (!newMomentDate) {
      toast({
        title: "Date required",
        description: "Please select a date for your moment",
        variant: "destructive",
      });
      return;
    }

    addMoment({
      title: newMomentTitle,
      startDate: newMomentDate,
      location: newMomentLocation.trim() || undefined,
      note: newMomentNote.trim() || undefined,
    });

    setNewMomentTitle("");
    setNewMomentDate(new Date());
    setNewMomentLocation("");
    setNewMomentNote("");
    setIsAddingMoment(false);
    
    toast({
      title: "Moment added",
      description: "Your new moment has been created",
    });
  };

  return (
    <div className="min-h-screen bg-[#1a1f2c] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="uppercase tracking-widest text-sm mb-2 text-[#e8c282] text-center" style={{ letterSpacing: "0.22em" }}>moments</div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#edd6ae] mb-1 tracking-wide text-center drop-shadow-md">Time Capsule</h1>
          <div
            className="text-[#e8c282bb] text-xs font-light text-center opacity-80 max-w-md mx-auto px-2"
            style={{
              fontWeight: 300,
              fontFamily: "Inter, system-ui, sans-serif",
              letterSpacing: "0.07em",
              lineHeight: 1.7,
              textTransform: "lowercase",
              fontStyle: "normal"
            }}
          >
            capturing the essence of time, one moment at a time
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <Button
            onClick={() => setIsAddingMoment(true)}
            className="
              bg-[#e8c282] text-[#1a1f2c]
              hover:bg-[#edd6ae] transition-all duration-300
              px-6 py-2 rounded-xl
              flex items-center gap-2
              shadow-[0_0_15px_0_#e8c28233]
              hover:shadow-[0_0_25px_0_#e8c28266]
              font-medium
            "
          >
            <Plus className="h-5 w-5" />
            <span>Add Moment</span>
          </Button>
        </div>

        <MomentsSection />

        <Sheet open={isAddingMoment} onOpenChange={setIsAddingMoment}>
          <SheetContent className="bg-[#161213] border-l border-[#e8c28233] text-[#edd6ae]">
            <SheetHeader>
              <SheetTitle className="text-[#edd6ae] text-center text-xl tracking-wide lowercase">New Moment</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 mt-8">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#e8c282] block text-center lowercase tracking-wider">Title</label>
                <Input
                  value={newMomentTitle}
                  onChange={(e) => setNewMomentTitle(e.target.value)}
                  placeholder="Enter moment title"
                  className="bg-[#1a1f2c] border-[#e8c28244] text-[#edd6ae] text-center"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#e8c282] block text-center lowercase tracking-wider">Date & Time</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start bg-[#161213] border-[#e8c28244] text-[#edd6ae] hover:bg-[#e8c28215]">
                      {newMomentDate ? (
                        format(newMomentDate, "PPP p")
                      ) : (
                        <span>Pick a date and time</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-[#1a1f2c] border border-[#e8c28233]">
                    <div className="p-3">
                      <Calendar
                        mode="single"
                        selected={newMomentDate}
                        onSelect={setNewMomentDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                      <div className="px-3 pb-2">
                        <Input
                          type="time"
                          className="mt-2 bg-[#161213] border-[#e8c28244] text-[#edd6ae]"
                          onChange={(e) => {
                            if (newMomentDate && e.target.value) {
                              const [hours, minutes] = e.target.value.split(':');
                              const newDate = new Date(newMomentDate);
                              newDate.setHours(parseInt(hours), parseInt(minutes));
                              setNewMomentDate(newDate);
                            }
                          }}
                          defaultValue={newMomentDate ? format(newMomentDate, "HH:mm") : undefined}
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#e8c282] block text-center lowercase tracking-wider">
                  Location <span className="text-[#e8c28277]">(optional)</span>
                </label>
                <Input
                  value={newMomentLocation}
                  onChange={(e) => setNewMomentLocation(e.target.value)}
                  placeholder="Enter location"
                  className="bg-[#161213] border-[#e8c28244] text-[#edd6ae] text-center"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#e8c282] block text-center lowercase tracking-wider">
                  Memories <span className="text-[#e8c28277]">(optional)</span>
                </label>
                <textarea
                  value={newMomentNote}
                  onChange={(e) => setNewMomentNote(e.target.value)}
                  placeholder="Add a special memory or note about this moment..."
                  className="w-full min-h-[100px] bg-[#161213] border border-[#e8c28244] text-[#edd6ae] rounded-md p-3 text-center placeholder:text-[#e8c28277]"
                />
              </div>
              <Button
                onClick={handleAddMoment}
                className="w-full bg-[#e8c282] text-[#1a1f2c] hover:bg-[#edd6ae] transition-all duration-300
                  shadow-[0_0_15px_0_#e8c28233] hover:shadow-[0_0_25px_0_#e8c28266]"
              >
                Create Moment
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default Moments;
