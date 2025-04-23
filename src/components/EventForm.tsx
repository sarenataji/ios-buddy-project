
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EMOJI_OPTIONS, COLOR_OPTIONS, WEEKDAYS } from "@/utils/scheduleConstants";
import { Repeat } from "lucide-react";

interface EventFormProps {
  event: {
    title: string;
    startTime?: string;
    endTime?: string;
    person: string;
    location: string;
    color: string;
    icon: string;
    repeat: {
      enabled: boolean;
      days: string[];
    };
  };
  isEditing?: boolean;
  onSubmit: () => void;
  onChange: (updatedEvent: any) => void;
  onWeekdayToggle: (day: string, isAdd: boolean, isEditing?: boolean) => void;
}

const EventForm = ({ 
  event, 
  isEditing = false, 
  onSubmit, 
  onChange,
  onWeekdayToggle 
}: EventFormProps) => {
  // Function to handle custom color input
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({...event, color: e.target.value});
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-[#e8c282]">Event Title</label>
        <Input 
          value={event.title}
          onChange={(e) => onChange({...event, title: e.target.value})}
          placeholder="Enter event title"
          className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
        />
      </div>
      
      {!isEditing && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-[#e8c282]">Start Time</label>
            <Input 
              type="time"
              value={event.startTime}
              onChange={(e) => onChange({...event, startTime: e.target.value})}
              className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
              style={{colorScheme: "dark"}}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-[#e8c282]">End Time</label>
            <Input 
              type="time"
              value={event.endTime}
              onChange={(e) => onChange({...event, endTime: e.target.value})}
              className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
              style={{colorScheme: "dark"}}
            />
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-sm text-[#e8c282]">Person/Category</label>
        <Input 
          value={event.person}
          onChange={(e) => onChange({...event, person: e.target.value})}
          placeholder="Personal, Work, Family..."
          className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-[#e8c282]">Location (optional)</label>
        <Input 
          value={event.location}
          onChange={(e) => onChange({...event, location: e.target.value})}
          placeholder="Enter location"
          className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae]"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-[#e8c282] mb-1 block">Icon</label>
        <div className="flex space-x-2">
          <div 
            className="h-10 w-10 flex items-center justify-center rounded border border-[#e8c28233] bg-[#1a1f2c]/80 cursor-pointer"
            style={{backgroundColor: event.color ? `${event.color}33` : undefined}}
          >
            <span className="text-xl">{event.icon}</span>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae] hover:bg-[#e8c28222]">
                Choose Icon
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-[#1a1f2c] border border-[#e8c28233]">
              <div className="grid grid-cols-6 gap-2">
                {EMOJI_OPTIONS.map((emoji) => (
                  <Button 
                    key={emoji} 
                    variant="ghost" 
                    className="h-9 w-9 p-0 hover:bg-[#e8c28222]"
                    onClick={() => onChange({...event, icon: emoji})}
                  >
                    <span className="text-xl">{emoji}</span>
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-[#e8c282] mb-1 block">Color</label>
        <div className="flex space-x-2 flex-wrap gap-2">
          <div 
            className="h-10 w-10 rounded border border-[#e8c28233] cursor-pointer flex items-center justify-center"
            style={{backgroundColor: event.color}}
          />
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-[#1a1f2c]/80 border-[#e8c28233] text-[#edd6ae] hover:bg-[#e8c28222]">
                Preset Colors
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-[#1a1f2c] border border-[#e8c28233]">
              <div className="grid grid-cols-4 gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <Button 
                    key={color} 
                    variant="ghost" 
                    className="h-8 w-12 p-0 border border-[#e8c28233]"
                    style={{backgroundColor: color}}
                    onClick={() => onChange({...event, color})}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
          
          <div className="flex-grow">
            <Input
              type="color"
              id="colorPicker"
              value={event.color}
              onChange={handleColorChange}
              className="w-full h-10 cursor-pointer bg-[#1a1f2c]/80 border-[#e8c28233]"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="repeat-event"
            checked={event.repeat.enabled}
            onChange={(e) => onChange({
              ...event,
              repeat: {
                ...event.repeat,
                enabled: e.target.checked
              }
            })}
            className="rounded border-[#e8c28233] bg-[#1a1f2c]/80 text-[#e8c282]"
          />
          <label htmlFor="repeat-event" className="text-sm text-[#e8c282] flex items-center gap-1">
            <Repeat size={14} />
            Repeat Event
          </label>
        </div>
        
        {event.repeat.enabled && (
          <div className="ml-6 mt-2">
            <p className="text-xs text-[#e8c282aa] mb-2">Select days to repeat:</p>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((day) => (
                <Button
                  key={day}
                  type="button"
                  variant={event.repeat.days.includes(day) ? "default" : "outline"}
                  className={
                    event.repeat.days.includes(day)
                      ? "bg-[#e8c282] text-[#1a1f2c] hover:bg-[#e8c282cc] h-8"
                      : "border-[#e8c28233] text-[#e8c282] hover:bg-[#e8c28222] hover:text-[#edd6ae] h-8"
                  }
                  onClick={() => onWeekdayToggle(
                    day,
                    !event.repeat.days.includes(day),
                    isEditing
                  )}
                >
                  {day.slice(0, 3)}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Button 
        onClick={onSubmit}
        className="w-full bg-[#e8c282] hover:bg-[#edd6ae] text-[#1a1f2c]"
      >
        {isEditing ? 'Save Changes' : 'Add Event'}
      </Button>
    </div>
  );
};

export default EventForm;
