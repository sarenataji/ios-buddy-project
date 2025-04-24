
import React from "react";
import { MoveVertical } from "lucide-react";
import { useMoment } from "@/contexts/MomentContext";
import ElapsedTimeDisplay from "@/components/ElapsedTimeDisplay";

interface MomentItemProps {
  id: number;
  title: string;
  startDate: Date;
  location?: string;
  description?: string;
  note?: string;
  isPredefined?: boolean;
  onEdit: (id: number) => void;
  onDragStart: (e: React.DragEvent, id: number) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, id: number) => void;
}

const MomentItem = ({
  id,
  title,
  startDate,
  location,
  description,
  note,
  isPredefined,
  onEdit,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop
}: MomentItemProps) => {
  const { stopMoment } = useMoment();

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isPredefined) {
      stopMoment(id);
    }
  };

  return (
    <div 
      draggable={!isPredefined}
      onDragStart={(e) => onDragStart(e, id)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, id)}
      className={`relative ${!isPredefined ? 'cursor-move' : ''}`}
    >
      {!isPredefined && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-6 text-[#e8c28277]">
          <MoveVertical size={16} />
        </div>
      )}
      <ElapsedTimeDisplay
        id={id}
        title={title}
        startDate={startDate}
        location={location}
        description={description}
        note={note}
        onEdit={onEdit}
        onStop={!isPredefined ? handleStop : undefined}
      />
    </div>
  );
};

export default MomentItem;
