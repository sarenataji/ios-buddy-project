
import React from "react";
import { format, formatDistanceStrict, differenceInYears, differenceInMonths, differenceInWeeks } from "date-fns";
import { mapPin } from "lucide-react";
import { Card } from "@/components/ui/card";

const BIRTHDATE = new Date(1996, 8, 23); // Example: 23 Sep 1996 (month is 0-indexed)
const NAME = "Sarena";
const LOCATION = "Los Angeles";

function calculateAgeInfo(birthdate: Date, now: Date) {
  const years = differenceInYears(now, birthdate);
  const months = differenceInMonths(now, birthdate) % 12;
  const weeks = Math.floor(differenceInWeeks(now, birthdate));
  return { years, months, weeks };
}

const Profile = () => {
  const today = new Date();
  const ageInfo = calculateAgeInfo(BIRTHDATE, today);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 pb-12 pt-8">
      {/* Section Title */}
      <div className="uppercase tracking-widest text-sm mb-2 text-[#e8c282] text-center" style={{letterSpacing: "0.22em"}}>Profile</div>
      {/* Name */}
      <div className="font-serif text-5xl md:text-6xl font-bold text-[#edd6ae] mb-6 tracking-wide text-center drop-shadow-md">{NAME}</div>
      {/* Years / Months / Weeks */}
      <div className="flex flex-row flex-wrap justify-center gap-4 mb-5">
        <div className="flex flex-col items-center bg-[#221709]/60 px-8 py-4 rounded-2xl border border-[#e8c28244] shadow-[0_0_12px_0_#e8c28233]" style={{minWidth:100}}>
          <div className="text-4xl md:text-5xl font-semibold text-[#edd6ae] mb-1">{ageInfo.years}</div>
          <div className="uppercase text-xs text-[#e8c282] tracking-widest">years</div>
        </div>
        <div className="flex flex-col items-center bg-[#221709]/60 px-8 py-4 rounded-2xl border border-[#e8c28244] shadow-[0_0_12px_0_#e8c28233]" style={{minWidth:100}}>
          <div className="text-4xl md:text-5xl font-semibold text-[#edd6ae] mb-1">{ageInfo.months}</div>
          <div className="uppercase text-xs text-[#e8c282] tracking-widest">months</div>
        </div>
        <div className="flex flex-col items-center bg-[#221709]/60 px-8 py-4 rounded-2xl border border-[#e8c28244] shadow-[0_0_12px_0_#e8c28233]" style={{minWidth:100}}>
          <div className="text-4xl md:text-5xl font-semibold text-[#edd6ae] mb-1">{ageInfo.weeks}</div>
          <div className="uppercase text-xs text-[#e8c282] tracking-widest">weeks</div>
        </div>
      </div>
      {/* Location */}
      <div className="flex flex-row items-center gap-2 mb-7 justify-center">
        <span>
          <svg width="18" height="18" fill="none" stroke="#e8c282" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
            <path d="M17 7.5C17 13.5 9 17 9 17C9 17 1 13.5 1 7.5C1 4.186 4.134 1.5 8 1.5C11.866 1.5 15 4.186 15 7.5Z" />
            <circle cx="9" cy="7.5" r="2.5"/>
          </svg>
        </span>
        <span className="text-lg font-medium text-[#e8c282]">{LOCATION}</span>
      </div>
      {/* Today's Date */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center mt-3">
        <div className="rounded-3xl border border-[#e8c28266] bg-[#251912]/70 text-[#edd6ae] text-center shadow-[0_0_25px_0_#e8c28222] px-10 py-7 mb-2">
          <div className="text-3xl md:text-4xl font-serif font-bold mb-1 tracking-tight" style={{letterSpacing: "0.02em"}}>{format(today, "MMMM d, yyyy")}</div>
          <div className="uppercase text-base md:text-lg text-[#e8c282bb] tracking-widest">{format(today, "EEEE")}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
