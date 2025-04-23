
import React from "react";
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { MoreVertical } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ScheduleItemProps {
  time: string;
  title: string;
  description: string;
  person: string;
  icon?: React.ReactNode;
  color?: string;
  progress: number;
  timeLeft: string;
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
}: ScheduleItemProps) => {
  return (
    <div className="relative mb-6 w-full">
      <div className="flex items-center mb-1">
        <div className="text-[#e8c282aa] text-sm">{time}</div>
      </div>
      <Card className="w-full bg-[#1a1f2c]/90 border border-[#e8c28233] shadow-[0_4px_15px_0_#e8c28215]">
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
              <div className="flex items-center text-xs text-[#e8c282aa]">
                <span>{description}</span>
                <span className="mx-1.5">•</span>
                <span>{person}</span>
              </div>
            </div>
          </div>
          <button className="text-[#e8c282aa] hover:text-[#edd6ae] p-1.5">
            <MoreVertical size={18} />
          </button>
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
              progress === 100 ? "bg-[#927c41]" : ""
            )}
          />
        </div>
      </Card>
    </div>
  );
};

export default ScheduleItem;
