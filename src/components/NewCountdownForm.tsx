
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NewCountdownFormProps {
  onSubmit: (data: {
    title: string;
    startDate: Date;
    endDate: Date;
    location?: string;
    note?: string;
  }) => void;
}

const NewCountdownForm = ({ onSubmit }: NewCountdownFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    startDate: new Date(),
    endDate: new Date(),
    location: "",
    note: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: "",
      startDate: new Date(),
      endDate: new Date(),
      location: "",
      note: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div className="space-y-2">
        <label className="text-sm text-[#e8c282]">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Event title"
          required
          className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-[#e8c282]">Start Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(formData.startDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-[#1a0c05] border-[#e8c28233]">
            <Calendar
              mode="single"
              selected={formData.startDate}
              onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
              initialFocus
              className="bg-[#1a0c05]"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-[#e8c282]">End Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(formData.endDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-[#1a0c05] border-[#e8c28233]">
            <Calendar
              mode="single"
              selected={formData.endDate}
              onSelect={(date) => date && setFormData({ ...formData, endDate: date })}
              initialFocus
              className="bg-[#1a0c05]"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-[#e8c282]">Location (optional)</label>
        <Input
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Event location"
          className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-[#e8c282]">Notes (optional)</label>
        <Textarea
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          placeholder="Add any notes..."
          className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae] min-h-[100px]"
        />
      </div>

      <Button 
        type="submit"
        className="w-full bg-[#e8c282] hover:bg-[#edd6ae] text-[#1a1f2c]"
      >
        Add Countdown
      </Button>
    </form>
  );
};

export default NewCountdownForm;
