
import React from "react";
import { useCountdown } from "@/hooks/useCountdown";
import CountdownTimer from "./CountdownTimer";

const CountdownList = () => {
  const { countdowns, completeCountdown } = useCountdown();
  const activeCountdowns = countdowns.filter(c => !c.isCompleted);

  if (activeCountdowns.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-[#e8c282] tracking-[0.25em] font-serif uppercase text-sm font-semibold mb-6">
        Active Countdowns
      </h2>
      {activeCountdowns.map((countdown) => (
        <div
          key={countdown.id}
          className="bg-[#1a0c05] rounded-xl p-6 space-y-4 border border-[#e8c28233]"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[#edd6ae] text-lg font-medium mb-1">{countdown.title}</h3>
              {countdown.location && (
                <p className="text-[#e8c282aa] text-sm">{countdown.location}</p>
              )}
            </div>
          </div>
          <CountdownTimer 
            targetDate={countdown.endDate} 
            onComplete={() => completeCountdown(countdown.id)}
          />
          {countdown.note && (
            <p className="text-[#e8c282aa] text-sm mt-4">{countdown.note}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default CountdownList;
