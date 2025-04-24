
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  // For year and month picker
  const [startMonth, setStartMonth] = useState<Date>(new Date());
  const [endMonth, setEndMonth] = useState<Date>(new Date());

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

  // Generate array of years for the dropdown (current year and next 10 years)
  const years = Array.from({ length: 11 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return { value: year.toString(), label: year.toString() };
  });

  // Generate array of months for the dropdown
  const months = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  const handleStartMonthChange = (month: string) => {
    const newDate = new Date(startMonth);
    newDate.setMonth(parseInt(month));
    setStartMonth(newDate);
  };

  const handleStartYearChange = (year: string) => {
    const newDate = new Date(startMonth);
    newDate.setFullYear(parseInt(year));
    setStartMonth(newDate);
  };

  const handleEndMonthChange = (month: string) => {
    const newDate = new Date(endMonth);
    newDate.setMonth(parseInt(month));
    setEndMonth(newDate);
  };

  const handleEndYearChange = (year: string) => {
    const newDate = new Date(endMonth);
    newDate.setFullYear(parseInt(year));
    setEndMonth(newDate);
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
            <div className="p-2 flex items-center justify-between">
              <Select onValueChange={handleStartMonthChange}>
                <SelectTrigger className="w-[110px] bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]">
                  <SelectValue placeholder={months[startMonth.getMonth()].label} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a0c05] border-[#e8c28233]">
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value} className="text-[#edd6ae]">
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select onValueChange={handleStartYearChange}>
                <SelectTrigger className="w-[90px] bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]">
                  <SelectValue placeholder={startMonth.getFullYear()} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a0c05] border-[#e8c28233]">
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value} className="text-[#edd6ae]">
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Calendar
              mode="single"
              selected={formData.startDate}
              onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
              month={startMonth}
              onMonthChange={setStartMonth}
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
            <div className="p-2 flex items-center justify-between">
              <Select onValueChange={handleEndMonthChange}>
                <SelectTrigger className="w-[110px] bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]">
                  <SelectValue placeholder={months[endMonth.getMonth()].label} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a0c05] border-[#e8c28233]">
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value} className="text-[#edd6ae]">
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select onValueChange={handleEndYearChange}>
                <SelectTrigger className="w-[90px] bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]">
                  <SelectValue placeholder={endMonth.getFullYear()} />
                </SelectTrigger>
                <SelectContent className="bg-[#1a0c05] border-[#e8c28233]">
                  {years.map((year) => (
                    <SelectItem key={year.value} value={year.value} className="text-[#edd6ae]">
                      {year.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Calendar
              mode="single"
              selected={formData.endDate}
              onSelect={(date) => date && setFormData({ ...formData, endDate: date })}
              month={endMonth}
              onMonthChange={setEndMonth}
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
