
import React, { useState } from "react";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { MoreVertical, MapPin, Edit, Trash2, Check, ChevronRight, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

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
  isActive?: boolean;
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
  isActive = false,
  onEdit,
  onDelete,
  onComplete,
}: ScheduleItemProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Extract start and end time from description
  const timeRange = description.split(' - ');
  const startTime = timeRange[0];
  const endTime = timeRange.length > 1 ? timeRange[1] : '';

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
      "w-full overflow-hidden transition-all duration-300",
      completed ? "bg-[#1a1f2c]/60 opacity-70" : "bg-gradient-to-br from-[#1a1f2c]/95 to-[#11141c]",
      isCurrent && isActive ? "relative ring-1 ring-[#e8c282]/30 animate-pulse-subtle" : "",
      isActive 
        ? "ring-1 ring-[#e8c282]/30 shadow-[0_4px_25px_rgba(232,194,130,0.15)] rounded-3xl" 
        : "rounded-2xl border-[#e8c28218]"
    )}>
      <CardContent className={cn(
        "p-5 transition-all duration-300",
        isActive ? "opacity-100" : "opacity-90"
      )}>
        <div className="flex items-center gap-3 mb-3">
          <div 
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              isCurrent && isActive ? "ring-1 ring-[#e8c282]/30" : ""
            )}
            style={{ 
              backgroundColor: `${color}22`,
              boxShadow: isCurrent && isActive ? `0 0 10px ${color || "#8B5CF6"}40` : "none"
            }}
          >
            {renderIcon()}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-[#edd6ae] font-medium text-base">{title}</h3>
              
              {isActive && (
                <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <PopoverTrigger asChild>
                    <button 
                      className="text-[#e8c282aa] hover:text-[#edd6ae] p-1 rounded-full hover:bg-[#e8c28215] shrink-0"
                      onClick={() => setIsMenuOpen(true)}
                      aria-label="Event menu"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-1.5 bg-[#1a1f2c] border border-[#e8c28233]">
                    <div className="flex flex-col gap-0.5">
                      {!completed && onComplete && (
                        <button 
                          className="flex items-center gap-1.5 text-[#e8c282] hover:bg-[#e8c28222] px-2 py-1 rounded text-xs w-full text-left"
                          onClick={() => {
                            setIsMenuOpen(false);
                            if (onComplete) onComplete();
                          }}
                        >
                          <Check size={14} />
                          Complete
                        </button>
                      )}
                      <button 
                        className="flex items-center gap-1.5 text-[#e8c282] hover:bg-[#e8c28222] px-2 py-1 rounded text-xs w-full text-left"
                        onClick={() => {
                          setIsMenuOpen(false);
                          if (onEdit) onEdit();
                        }}
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button 
                        className="flex items-center gap-1.5 text-[#e8c282] hover:bg-[#e8c28222] px-2 py-1 rounded text-xs w-full text-left"
                        onClick={() => {
                          setIsMenuOpen(false);
                          if (onDelete) onDelete();
                        }}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 text-xs text-[#e8c282aa] mt-1">
              <span className="font-medium">{time}</span>
              {location && isActive && (
                <span className="flex items-center gap-0.5">
                  <MapPin size={10} />
                  {location}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-xs text-[#e8c282] font-medium">Progress</div>
            <div className="text-xs text-[#edd6ae]">{timeLeft}</div>
          </div>
          <Progress 
            value={progress} 
            className={cn(
              "h-1.5 bg-[#e8c28222]",
              completed ? "bg-[#927c41]" : "",
              progress === 100 ? "bg-[#927c41]" : "",
              isCurrent && isActive ? "bg-[#e8c282]/30" : ""
            )}
            style={{
              "--progress-background": isCurrent ? "#e8c282" : color,
            } as React.CSSProperties}
          />
        </div>
        
        {isActive && (
          <>
            <div className="flex justify-between items-center mt-4">
              <div className="flex flex-col">
                <span className="text-xs text-[#e8c282aa]">Start</span>
                <span className="text-sm text-[#edd6ae]">{startTime}</span>
              </div>
              
              <div className="flex-1 mx-2 h-px bg-[#e8c28222]"></div>
              
              <div className="flex flex-col">
                <span className="text-xs text-[#e8c282aa]">End</span>
                <span className="text-sm text-[#edd6ae]">{endTime}</span>
              </div>
            </div>
            
            {person && (
              <div className="mt-4 pt-3 border-t border-[#e8c28222] flex justify-between items-center">
                <span className="text-xs text-[#e8c282aa]">{person}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#e8c282] hover:text-[#edd6ae] hover:bg-[#e8c28222] p-1 h-8"
                >
                  <span className="text-xs mr-1">Next Step</span>
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleItem;
