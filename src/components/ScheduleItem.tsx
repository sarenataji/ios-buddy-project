
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
  const [showStepIndicator, setShowStepIndicator] = useState(false);
  
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

  // Steps for the event (simulated)
  const eventSteps = ["Preparation", "Implementation", "Review", "Follow-up"];
  
  return (
    <Card className={cn(
      "w-full overflow-hidden transition-all duration-300",
      completed ? "bg-[#2a1f15]/60 opacity-70" : "bg-gradient-to-br from-[#2a1f15]/95 to-[#1a150e]",
      isCurrent && isActive ? "relative ring-1 ring-[#c69c6d]/30 animate-pulse-subtle" : "",
      isActive 
        ? "ring-1 ring-[#c69c6d]/30 shadow-[0_4px_25px_rgba(198,156,109,0.15)] rounded-3xl" 
        : "rounded-2xl border-[#c69c6d18]"
    )}>
      <CardContent className={cn(
        "p-5 transition-all duration-300",
        isActive ? "opacity-100" : "opacity-90"
      )}>
        <div className="flex items-center gap-3 mb-3">
          <div 
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              isCurrent && isActive ? "ring-1 ring-[#c69c6d]/30" : ""
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
              <h3 className="text-[#a67c50] font-medium text-base">{title}</h3>
              
              {isActive && (
                <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <PopoverTrigger asChild>
                    <button 
                      className="text-[#c69c6daa] hover:text-[#a67c50] p-1 rounded-full hover:bg-[#c69c6d15] shrink-0"
                      onClick={() => setIsMenuOpen(true)}
                      aria-label="Event menu"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-1.5 bg-[#2a1f15] border border-[#c69c6d33]">
                    <div className="flex flex-col gap-0.5">
                      {!completed && onComplete && (
                        <button 
                          className="flex items-center gap-1.5 text-[#c69c6d] hover:bg-[#c69c6d22] px-2 py-1 rounded text-xs w-full text-left"
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
                        className="flex items-center gap-1.5 text-[#c69c6d] hover:bg-[#c69c6d22] px-2 py-1 rounded text-xs w-full text-left"
                        onClick={() => {
                          setIsMenuOpen(false);
                          if (onEdit) onEdit();
                        }}
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button 
                        className="flex items-center gap-1.5 text-[#c69c6d] hover:bg-[#c69c6d22] px-2 py-1 rounded text-xs w-full text-left"
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
            
            <div className="flex flex-wrap gap-2 text-xs text-[#c69c6daa] mt-1">
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
            <div className="text-xs text-[#c69c6d] font-medium">Progress</div>
            <div className="text-xs text-[#a67c50]">{timeLeft}</div>
          </div>
          <Progress 
            value={progress} 
            className={cn(
              "h-1.5 bg-[#c69c6d22]",
              completed ? "bg-[#7c6041]" : "",
              progress === 100 ? "bg-[#7c6041]" : "",
              isCurrent && isActive ? "bg-[#c69c6d]/30" : ""
            )}
            style={{
              "--progress-background": isCurrent ? "#c69c6d" : color,
            } as React.CSSProperties}
          />
        </div>
        
        {isActive && (
          <>
            <div className="flex justify-between items-center mt-4">
              <div className="flex flex-col">
                <span className="text-xs text-[#c69c6daa]">Start</span>
                <span className="text-sm text-[#a67c50]">{startTime}</span>
              </div>
              
              <div className="flex-1 mx-2 h-px bg-[#c69c6d22]"></div>
              
              <div className="flex flex-col">
                <span className="text-xs text-[#c69c6daa]">End</span>
                <span className="text-sm text-[#a67c50]">{endTime}</span>
              </div>
            </div>
            
            {person && (
              <div className="mt-4 pt-3 border-t border-[#c69c6d22] flex justify-between items-center">
                <span className="text-xs text-[#c69c6daa]">{person}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#c69c6d] hover:text-[#a67c50] hover:bg-[#c69c6d22] p-1 h-8"
                  onClick={() => setShowStepIndicator(!showStepIndicator)}
                >
                  <span className="text-xs mr-1">Next Step</span>
                  <ChevronRight size={16} />
                </Button>
              </div>
            )}

            {/* Step Indicator */}
            {showStepIndicator && (
              <div className="mt-4 pt-3 border-t border-[#c69c6d22] animate-fade-in">
                <div className="text-xs text-[#c69c6d] mb-2">Event Steps</div>
                <div className="flex justify-between items-center w-full px-2">
                  {eventSteps.map((step, index) => (
                    <div key={`step-${index}`} className="flex flex-col items-center">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 
                          ${index === 1 ? 'bg-[#c69c6d] text-[#2a1f15] font-medium' : 'bg-[#c69c6d33] text-[#c69c6d]'}`}
                      >
                        {index + 1}
                      </div>
                      <div className={`text-xs ${index === 1 ? 'text-[#c69c6d] font-medium' : 'text-[#c69c6d88]'}`}>
                        {index === 1 && <span className="absolute -mt-5 text-[10px] text-[#c69c6d]">Here</span>}
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full h-1 bg-[#c69c6d33] relative mt-2">
                  <div className="absolute h-1 bg-[#c69c6d]" style={{ width: '35%' }}></div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ScheduleItem;
