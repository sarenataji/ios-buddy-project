
import React, { useEffect, useState } from "react";
import { format, differenceInYears, differenceInMonths, differenceInWeeks, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds } from "date-fns";
import { MapPin } from "lucide-react";
import ProfileStat from "@/components/ProfileStat";

const BIRTHDATE = new Date(1996, 8, 23, 0, 0, 0); // 23 Sep 1996 (month is 0-indexed)
const NAME = "Sarena";
const LOCATION = "Los Angeles";

// Calculate live time difference (as granular as needed)
function getBreakdown(birthdate: Date, now: Date) {
  // Helper functions
  let years = differenceInYears(now, birthdate);
  let dAfterYears = new Date(birthdate);
  dAfterYears.setFullYear(birthdate.getFullYear() + years);

  let months = differenceInMonths(now, dAfterYears);
  let dAfterMonths = new Date(dAfterYears);
  dAfterMonths.setMonth(dAfterYears.getMonth() + months);

  let weeks = differenceInWeeks(now, dAfterMonths);
  let dAfterWeeks = new Date(dAfterMonths);
  dAfterWeeks.setDate(dAfterMonths.getDate() + weeks * 7);

  let days = differenceInDays(now, dAfterWeeks);
  let dAfterDays = new Date(dAfterWeeks);
  dAfterDays.setDate(dAfterWeeks.getDate() + days);

  let hours = differenceInHours(now, dAfterDays);
  let dAfterHours = new Date(dAfterDays);
  dAfterHours.setHours(dAfterDays.getHours() + hours);

  let minutes = differenceInMinutes(now, dAfterHours);
  let dAfterMinutes = new Date(dAfterHours);
  dAfterMinutes.setMinutes(dAfterHours.getMinutes() + minutes);

  let seconds = differenceInSeconds(now, dAfterMinutes);

  // For overall weeks (for the big "WEEKS" stat)
  let overallWeeks = differenceInWeeks(now, birthdate);

  return {
    years,
    months,
    weeks: overallWeeks,
    detailsYear: { years, months, weeks: differenceInWeeks(now, birthdate), days, hours, minutes, seconds },
    detailsMonth: { years, months, weeks: differenceInWeeks(now, birthdate), days, hours, minutes, seconds },
    detailsWeek: { years, months, weeks: differenceInWeeks(now, birthdate), days, hours, minutes, seconds },
  };
}

const Profile = () => {
  const [now, setNow] = useState(() => new Date());

  // Rolling update, every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const breakdown = getBreakdown(BIRTHDATE, now);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 pb-12 pt-8">
      {/* Section Title */}
      <div className="uppercase tracking-widest text-sm mb-2 text-[#e8c282] text-center" style={{letterSpacing: "0.22em"}}>Profile</div>
      {/* Name */}
      <div className="font-serif text-5xl md:text-6xl font-bold text-[#edd6ae] mb-8 tracking-wide text-center drop-shadow-md">{NAME}</div>
      {/* Stats: Vertical, interactive, rolling */}
      <div className="flex flex-col gap-5 w-full max-w-xs mx-auto mb-5">
        <ProfileStat
          label="YEARS"
          value={breakdown.years}
          details={breakdown.detailsYear}
        />
        <ProfileStat
          label="MONTHS"
          value={breakdown.months}
          details={breakdown.detailsMonth}
        />
        <ProfileStat
          label="WEEKS"
          value={breakdown.weeks}
          details={breakdown.detailsWeek}
        />
      </div>
      {/* Location */}
      <div className="flex flex-row items-center gap-2 mb-7 justify-center">
        <MapPin color="#e8c282" size={21} />
        <span className="text-lg font-medium text-[#e8c282]">{LOCATION}</span>
      </div>
      {/* Today's Date */}
      <div className="w-full max-w-md mx-auto flex flex-col items-center mt-3">
        <div className="rounded-3xl border border-[#e8c28233] bg-[#1a1f2c]/80 text-[#edd6ae] text-center shadow-[0_0_25px_0_#e8c28215] px-10 py-8 mb-2">
          <div className="text-3xl md:text-4xl font-serif font-bold mb-1 tracking-tight" style={{letterSpacing: "0.02em"}}>
            {format(now, "MMMM d, yyyy")}
          </div>
          <div className="uppercase text-base md:text-lg text-[#e8c282bb] tracking-widest">{format(now, "EEEE")}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

