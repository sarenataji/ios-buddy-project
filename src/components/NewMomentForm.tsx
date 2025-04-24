import { useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

interface NewMomentFormProps {
  onSubmit: (data: {
    title: string;
    startDate: Date;
    location?: string;
    note?: string;
  }) => void;
}

const NewMomentForm = ({ onSubmit }: NewMomentFormProps) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your moment",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      toast({
        title: "Date required",
        description: "Please select a date for your moment",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      title,
      startDate: date,
      location: location.trim() || undefined,
      note: note.trim() || undefined,
    });

    setTitle("");
    setDate(new Date());
    setLocation("");
    setNote("");
  };

  return (
    <div className="space-y-6 mt-8">
      <div className="space-y-2">
        <label className="text-[#e8c282] text-sm block text-center lowercase tracking-wider mb-2">title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter moment title"
          className="bg-[#1a1f2c] border-[#e8c28233] text-[#edd6ae] text-center placeholder:text-[#e8c28277]"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[#e8c282] text-sm block text-center lowercase tracking-wider mb-2">date & time</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-center bg-[#1a1f2c] border-[#e8c28233] text-[#edd6ae] hover:bg-[#1a2232]">
              {date ? format(date, "PPP p") : <span className="text-[#e8c28277]">Pick a date and time</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-[#1a1f2c] border border-[#e8c28233]">
            <div className="p-3">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="text-[#edd6ae]"
              />
              <div className="px-3 pb-2">
                <Input
                  type="time"
                  className="mt-2 bg-[#1a1f2c] border-[#e8c28233] text-[#edd6ae]"
                  onChange={(e) => {
                    if (date && e.target.value) {
                      const [hours, minutes] = e.target.value.split(':');
                      const newDate = new Date(date);
                      newDate.setHours(parseInt(hours), parseInt(minutes));
                      setDate(newDate);
                    }
                  }}
                  defaultValue={date ? format(date, "HH:mm") : undefined}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <label className="text-[#e8c282] text-sm block text-center lowercase tracking-wider mb-2">
          location <span className="text-[#e8c28277]">(optional)</span>
        </label>
        <Input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          className="bg-[#1a1f2c] border-[#e8c28233] text-[#edd6ae] text-center placeholder:text-[#e8c28277]"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[#e8c282] text-sm block text-center lowercase tracking-wider mb-2">
          memories <span className="text-[#e8c28277]">(optional)</span>
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a special memory or note about this moment..."
          className="w-full min-h-[100px] bg-[#1a1f2c] border border-[#e8c28233] text-[#edd6ae] rounded-md p-3 text-center placeholder:text-[#e8c28277]"
        />
      </div>
      <Button
        onClick={handleSubmit}
        className="w-full bg-[#e8c282] text-[#1a1f2c] hover:bg-[#edd6ae] transition-all duration-300"
      >
        Create Moment
      </Button>
    </div>
  );
};

export default NewMomentForm;
