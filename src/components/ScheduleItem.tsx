
import React, { useState } from "react";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { MoreVertical, MapPin, Edit, Trash2, Check } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ScheduleItemProps {
  time: string;
  title: string;
  description: string;
  person: string;
  icon?: React.ReactNode | string;
  color?: string;
  progress: number;
  timeLeft: string;
  location?: string;
  completed?: boolean;
  isCurrent?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onComplete?: () => void;
}

const ScheduleItem = ({
  time,
  title,
  description,
  person,
  icon,
  color = "#7e5a39",
  progress,
  timeLeft,
  location,
  completed = false,
  isCurrent = false,
  onEdit,
  onDelete,
  onComplete,
}: ScheduleItemProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Render icon or emoji
  const renderIcon = () => {
    if (typeof icon === 'string' && icon.length > 0) {
      return <span className="text-lg">{icon}</span>;
    } else if (icon) {
      return icon;
    } else {
      return (
        <div 
          className="w-4 h-4 rounded-full" 
          style={{ backgroundColor: color }}
        />
      );
    }
  };

  return (
    <Card className={cn(
      "w-full border border-[#e8c28233] shadow-[0_4px_15px_0_#e8c28215] overflow-hidden",
      completed ? "bg-[#1a1f2c]/60 opacity-70" : "bg-[#1a1f2c]/90",
      isCurrent ? "relative ring-1 ring-[#e8c282]/30" : ""
    )}>
      {/* Subtle indicator for current event */}
      {isCurrent && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#e8c282]"></div>
      )}
      
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${color}33` }}
            >
              {renderIcon()}
            </div>
            <div>
              <h3 className="text-[#edd6ae] font-medium text-base">{title}</h3>
              <div className="flex flex-wrap gap-1.5 items-center text-xs text-[#e8c282aa]">
                <span className="font-medium">{time}</span>
                <span>•</span>
                <span>{person}</span>
                {location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={10} />
                      {location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <PopoverTrigger asChild>
              <button 
                className="text-[#e8c282aa] hover:text-[#edd6ae] p-1.5 rounded-full hover:bg-[#e8c28215]"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Event menu"
              >
                <MoreVertical size={18} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 bg-[#1a1f2c] border border-[#e8c28233]">
              <div className="flex flex-col gap-1">
                {!completed && onComplete && (
                  <button 
                    className="flex items-center gap-2 text-[#e8c282] hover:bg-[#e8c28222] px-2 py-1.5 rounded text-sm w-full text-left"
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (onComplete) onComplete();
                    }}
                  >
                    <Check size={16} />
                    Mark Complete
                  </button>
                )}
                <button 
                  className="flex items-center gap-2 text-[#e8c282] hover:bg-[#e8c28222] px-2 py-1.5 rounded text-sm w-full text-left"
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (onEdit) onEdit();
                  }}
                >
                  <Edit size={16} />
                  Edit Event
                </button>
                <button 
                  className="flex items-center gap-2 text-[#e8c282] hover:bg-[#e8c28222] px-2 py-1.5 rounded text-sm w-full text-left"
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (onDelete) onDelete();
                  }}
                >
                  <Trash2 size={16} />
                  Delete Event
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <div className="text-xs text-[#e8c282aa]">Progress</div>
            <div className="text-xs text-[#edd6ae]">{timeLeft}</div>
          </div>
          <Progress 
            value={progress} 
            className={cn(
              "h-1 bg-[#e8c28222]",
              completed ? "bg-[#927c41]" : "",
              progress === 100 ? "bg-[#927c41]" : ""
            )}
            style={{
              "--progress-background": color,
            } as React.CSSProperties}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleItem;
