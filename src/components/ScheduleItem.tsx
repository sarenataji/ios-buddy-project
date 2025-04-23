
import React, { useState } from "react";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { MoreVertical, MapPin, Edit, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
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
  icon?: React.ReactNode;
  color?: string;
  progress: number;
  timeLeft: string;
  location?: string;
  completed?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ScheduleItem = ({
  time,
  title,
  description,
  person,
  icon,
  color = "#e8c282",
  progress,
  timeLeft,
  location,
  completed = false,
  onEdit,
  onDelete,
}: ScheduleItemProps) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className={cn(
      "relative mb-6 w-full transition-all duration-300",
      completed ? "opacity-70" : ""
    )}>
      <div className="flex items-center mb-1">
        <div className="text-[#e8c282aa] text-sm">{time}</div>
      </div>
      <Card className={cn(
        "w-full bg-[#1a1f2c]/90 border border-[#e8c28233] shadow-[0_4px_15px_0_#e8c28215]",
        completed ? "bg-[#1a1f2c]/60" : ""
      )}>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${color}33` }}
            >
              {icon || (
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: color }}
                ></div>
              )}
            </div>
            <div className="flex-grow">
              <h3 className="text-[#edd6ae] font-medium text-base">{title}</h3>
              <div className="flex flex-col xs:flex-row xs:items-center text-xs text-[#e8c282aa]">
                <span>{description}</span>
                <span className="hidden xs:block mx-1.5">•</span>
                <span>{person}</span>
                {location && (
                  <>
                    <span className="hidden xs:block mx-1.5">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {location}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <button 
                className="text-[#e8c282aa] hover:text-[#edd6ae] p-1.5"
                onClick={() => setShowMenu(true)}
              >
                <MoreVertical size={18} />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2 bg-[#1a1f2c] border border-[#e8c28233]">
              <div className="flex flex-col gap-1">
                <button 
                  className="flex items-center gap-2 text-[#e8c282] hover:bg-[#e8c28222] px-2 py-1.5 rounded text-sm"
                  onClick={() => {
                    setShowMenu(false);
                    if (onEdit) onEdit();
                  }}
                >
                  <Edit size={16} />
                  Edit Event
                </button>
                <button 
                  className="flex items-center gap-2 text-[#e8c282] hover:bg-[#e8c28222] px-2 py-1.5 rounded text-sm"
                  onClick={() => {
                    setShowMenu(false);
                    if (onDelete) onDelete();
                  }}
                >
                  <Trash2 size={16} />
                  Delete Event
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </CardContent>
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-xs text-[#e8c282aa]">Time left</div>
            <div className="text-xs text-[#edd6ae]">{timeLeft}</div>
          </div>
          <Progress 
            value={progress} 
            className={cn(
              "h-1.5 bg-[#e8c28222]",
              completed ? "bg-[#927c41]" : "",
              progress === 100 ? "bg-[#927c41]" : ""
            )}
          />
        </div>
      </Card>
    </div>
  );
};

export default ScheduleItem;
