import React, { useEffect, useState } from "react";
import { format, differenceInYears, differenceInMonths, differenceInWeeks, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, endOfDay, intervalToDuration } from "date-fns";
import { MapPin } from "lucide-react";
import ProfileStat from "@/components/ProfileStat";

const BIRTHDATE = new Date(1996, 8, 23, 0, 0, 0); // 23 Sep 1996 (month is 0-indexed)
const NICKNAME = "Sarena Ortega";
const MOTIVATION_QUOTE = "don't count the days, make the days count. time wasted is life wasted.";
const LOCATION = "Los Angeles";

function getBreakdown(birthdate: Date, now: Date) {
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
  dAfterHours.setHours(dAfterHours.getHours() + hours);

  let minutes = differenceInMinutes(now, dAfterHours);
  let dAfterMinutes = new Date(dAfterHours);
  dAfterMinutes.setMinutes(dAfterHours.getMinutes() + minutes);

  let seconds = differenceInSeconds(now, dAfterMinutes);

  let overallWeeks = differenceInWeeks(now, birthdate);

  const details = {
    years,
    months,
    weeks: overallWeeks,
    days,
    hours,
    minutes,
    seconds,
  };

  return {
    years,
    months,
    weeks: overallWeeks,
    details,
  };
}

function getTimeLeftTillEndOfDay(now: Date) {
  const end = endOfDay(now);
  const dur = intervalToDuration({ start: now, end });
  return {
    hours: dur.hours ?? 0,
    minutes: dur.minutes ?? 0,
    seconds: dur.seconds ?? 0,
  };
}

const Profile = () => {
  const [now, setNow] = useState(() => new Date());
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const breakdown = getBreakdown(BIRTHDATE, now);
  const countdown = getTimeLeftTillEndOfDay(now);

  const formatCountdown = (h: number, m: number, s: number) =>
    [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 pb-12 pt-8">
      <div className="uppercase tracking-widest text-sm mb-2 text-[#e8c282] text-center" style={{letterSpacing: "0.22em"}}>Profile</div>
      <div className="font-serif text-5xl md:text-6xl font-bold text-[#edd6ae] mb-1 tracking-wide text-center drop-shadow-md">{NICKNAME}</div>
      <div
        className="text-[#e8c282bb] text-xs md:text-sm font-light text-center opacity-80 max-w-md mx-auto px-4 mb-8"
        style={{
          fontWeight: 300,
          fontFamily: "Inter, system-ui, sans-serif",
          letterSpacing: "0.05em",
          lineHeight: 1.6,
        }}
      >
        "{MOTIVATION_QUOTE}"
      </div>
      <div className="flex flex-row gap-4 w-full max-w-xl mx-auto mb-7 items-stretch">
        <ProfileStat
          label="YEARS"
          value={breakdown.years}
          details={breakdown.details}
          open={openIndex === 0}
          setOpen={() => setOpenIndex(openIndex === 0 ? null : 0)}
        />
        <ProfileStat
          label="MONTHS"
          value={breakdown.months}
          details={breakdown.details}
          open={openIndex === 1}
          setOpen={() => setOpenIndex(openIndex === 1 ? null : 1)}
        />
        <ProfileStat
          label="WEEKS"
          value={breakdown.weeks}
          details={breakdown.details}
          open={openIndex === 2}
          setOpen={() => setOpenIndex(openIndex === 2 ? null : 2)}
        />
      </div>
      <div className="flex flex-row items-center gap-2 mb-7 justify-center">
        <MapPin color="#e8c282" size={21} />
        <span className="text-lg font-medium text-[#e8c282]">{LOCATION}</span>
      </div>
      <div className="w-full max-w-md mx-auto flex flex-col items-center mt-3">
        <div className="relative rounded-3xl border border-[#e8c28233] bg-[#1a1f2c]/80 text-[#edd6ae] text-center shadow-[0_0_25px_0_#e8c28215] px-10 py-8 mb-2">
          <div className="text-3xl md:text-4xl font-serif font-bold mb-1 tracking-tight" style={{letterSpacing: "0.02em"}}>
            {format(now, "MMMM d, yyyy")}
          </div>
          <div className="uppercase text-base md:text-lg text-[#e8c282bb] tracking-widest mb-3">{format(now, "EEEE")}</div>
          <div className="flex flex-col items-center justify-center w-full">
            <span className="block text-xs md:text-sm text-[#e8c282aa] font-medium mb-1 tracking-wide">
              Time left today
            </span>
            <div className="text-2xl md:text-3xl font-mono bg-[#18151c] rounded-xl px-8 py-2 font-bold text-[#EDD6AE] border border-[#e8c28229] tracking-widest shadow-[0_0_8px_0_#e8c28209] animate-fade-in">
              {formatCountdown(countdown.hours, countdown.minutes, countdown.seconds)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
