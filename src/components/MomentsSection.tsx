
import React from "react";
import { useMoment } from "@/contexts/MomentContext";
import ElapsedTimeDisplay from "@/components/ElapsedTimeDisplay";

export const MomentsSection = () => {
  const { moments, updateMoment, deleteMoment, moveMomentUp, moveMomentDown } = useMoment();

  return (
    <div className="space-y-6">
      {moments.map((moment, index) => (
        <div key={moment.id}>
          <ElapsedTimeDisplay
            id={moment.id}
            title={moment.title}
            startDate={moment.startDate}
            location={moment.location}
            description={moment.description}
            note={moment.note}
            onEdit={(id) => updateMoment(moment)}
            onMoveUp={index > 0 ? () => moveMomentUp(moment.id) : undefined}
            onMoveDown={index < moments.length - 1 ? () => moveMomentDown(moment.id) : undefined}
          />
        </div>
      ))}
    </div>
  );
};
