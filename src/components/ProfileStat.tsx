
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

/**
 * Props for ProfileStat component
 * @prop label (string): The label displayed below the main number (e.g. "YEARS", "MONTHS", etc.)
 * @prop value (number): The value displayed in the box.
 * @prop details (object): {years, months, weeks, days, hours, minutes, seconds} breakdown.
 */
type ProfileStatProps = {
  label: string;
  value: number | string;
  details?: {
    years: number;
    months: number;
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  open?: boolean;
  setOpen?: (v: boolean) => void;
  className?: string;
};

const ProfileStat: React.FC<ProfileStatProps> = ({
  label,
  value,
  details,
  open = false,
  setOpen,
  className = "",
}) => {
  // open/setOpen passed from parent controls which stat is open (only one)
  return (
    <div
      className={`
        flex-1 min-w-0 
        ${className}
      `}
    >
      <button
        className={`
          w-full
          flex flex-col items-center justify-center
          bg-[#1a1f2c]/85
          rounded-2xl border border-[#e8c28244]
          shadow-[0_0_30px_0_#e8c28215]
          py-5 select-none
          transition-all duration-150
          relative
          group
          hover:shadow-[0_0_35px_0_#e8c28246]
          ${open ? "ring-2 ring-[#EDD6AE]/40 z-10" : ""}
        `}
        type="button"
        tabIndex={0}
        onClick={() => setOpen && setOpen(!open)}
        aria-expanded={open}
      >
        <div className="flex items-center justify-center gap-1 text-3xl md:text-4xl font-bold font-serif text-[#EDD6AE] mb-1 transition-all duration-75">
          {value}
          {details && (
            <span>
              {open ? (
                <ChevronUp color="#e8c282" size={20} className="ml-0.5" />
              ) : (
                <ChevronDown color="#e8c282" size={20} className="ml-0.5" />
              )}
            </span>
          )}
        </div>
        <div className="uppercase text-[0.7rem] tracking-widest text-[#e8c282bb] font-medium">{label}</div>
      </button>
      {/* Breakdown content (collapsible) */}
      {open && details && (
        <div className="animate-fade-in mt-3 px-1 py-2 rounded-xl bg-[#231a13]/80 border border-[#e8c28222] text-[#e8c282ee] shadow-[0_0_14px_0_#e8c28212] text-center text-xs md:text-sm flex flex-col gap-1">
          <div>
            <span className="font-bold">{details.years}</span>y
            <span className="font-bold ml-1">{details.months}</span>m
            <span className="font-bold ml-1">{details.weeks}</span>w
            <span className="font-bold ml-1">{details.days}</span>d
          </div>
          <div>
            <span className="font-bold">{details.hours}</span>h
            <span className="font-bold ml-1">{details.minutes}</span>m
            <span className="font-bold ml-1">{details.seconds}</span>s
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileStat;
