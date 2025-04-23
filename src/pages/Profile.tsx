
import React, { useEffect, useState } from "react";
import { format, differenceInYears, differenceInMonths, differenceInWeeks, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, endOfDay, intervalToDuration } from "date-fns";
import { MapPin } from "lucide-react";
import ProfileStat from "@/components/ProfileStat";

const BIRTHDATE = new Date(1996, 8, 23, 0, 0, 0);
const NICKNAME = "sarena ortega";
const MOTIVATION_QUOTE = "don't count the days, make the days count. time wasted is life wasted.";
const LOCATION = "los angeles";

function getBreakdown(birthdate: Date, now: Date) {
  let years = differenceInYears(now, birthdate);
  let dAfterYears = new Date(birthdate);
  dAfterYears.setFullYear(birthdate.getFullYear() + years);

  let months = differenceInMonths(now, dAfterYears);
  let dAfterMonths = new Date(dAfterYears);
  dAfterMonths.setMonth(dAfterYears.getMonth() + months);

  let weeks = differenceInWeeks(now, birthdate);
  let dAfterWeeks = new Date(birthdate);
  dAfterWeeks.setDate(birthdate.getDate() + weeks * 7);

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

  const details = {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
  };

  return {
    years,
    months,
    weeks,
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

// NEW: Beautiful one-row, aesthetic breakdown bar with gold text, thin font, and a glowing border
function GlowingLifetimeBar({
  details,
}: {
  details: {
    years: number;
    months: number;
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}) {
  // Array for cleaner mapping & comma separation
  const items = [
    { value: details.years, unit: "years" },
    { value: details.months, unit: "months" },
    { value: details.weeks, unit: "weeks" },
    { value: details.days, unit: "days" },
    { value: details.hours, unit: "hours" },
    { value: details.minutes, unit: "minutes" },
    { value: details.seconds, unit: "seconds" },
  ];
  return (
    <div
      className="
        w-full
        px-8 py-6 
        rounded-3xl
        bg-[#1a1e18]/90
        border border-[#e8c28250]
        shadow-[0_0_32px_0_#e8c28210,0_2px_16px_0_#00000040]
        flex flex-row items-center justify-center
        transition-all
        animate-fade-in
        backdrop-blur-[3px]
        mx-auto
      "
      style={{
        maxWidth: 950,
        fontFamily: "Inter, system-ui, sans-serif",
        letterSpacing: "0.03em",
        boxShadow: "0 0 54px 0 #e8c28223, 0 2px 20px 0 #0007",
        borderWidth: 1.6,
      }}
    >
      <span className="w-full flex flex-row flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center">
        {items.map((entry, i) => (
          <span
            key={entry.unit}
            className="
              flex flex-row items-baseline
              text-[#dec897]
              font-thin
              text-[1.32rem] md:text-[1.48rem] 
              mr-0
              transition-colors
              select-none
              whitespace-nowrap
              drop-shadow-[0_1px_3px_#7e5a3940]
            "
            style={{ fontWeight: entry.unit === "years" || entry.unit === "months" || entry.unit === "weeks" ? 600 : 400, fontFamily: "Inter, system-ui, sans-serif" }}
          >
            <span
              className={`
                ${["years", "months", "weeks"].includes(entry.unit) 
                    ? "font-semibold"
                    : "font-normal"}
                text-[#ecd6ae]
                px-1
              `}
              style={{ 
                fontWeight: ["years", "months", "weeks"].includes(entry.unit) ? 600 : 400 
              }}
            >
              {entry.value}
            </span>
            <span className="pl-1 text-[1.02rem] md:text-[1.16rem] text-[#edd6aecc] font-light" style={{fontWeight: 400}}>
              {entry.unit}
            </span>
            {i < items.length - 1 && (
              <span className="mx-3 text-[#ecd6ae70] select-none text-[1.32rem] font-light">,</span>
            )}
          </span>
        ))}
      </span>
    </div>
  );
}

const Profile = () => {
  const [now, setNow] = useState(() => new Date());
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
      <div className="uppercase tracking-widest text-sm mb-2 text-[#e8c282] text-center" style={{ letterSpacing: "0.22em" }}>profile</div>
      <div className="font-serif text-5xl md:text-6xl font-bold text-[#edd6ae] mb-1 tracking-wide text-center drop-shadow-md">{NICKNAME}</div>
      <div
        className="text-[#e8c282bb] text-[11px] md:text-xs font-light text-center opacity-80 max-w-md mx-auto px-2 mb-10"
        style={{
          fontWeight: 300,
          fontFamily: "Inter, system-ui, sans-serif",
          letterSpacing: "0.07em",
          lineHeight: 1.7,
          textTransform: "lowercase",
          fontStyle: "normal"
        }}
      >
        "{MOTIVATION_QUOTE}"
      </div>
      {/* count boxes */}
      <div className="flex flex-col items-center w-full max-w-xl mx-auto mb-8">
        <div className="flex flex-row gap-5 w-full mb-3 items-stretch justify-center">
          <ProfileStat
            label="years"
            value={breakdown.years}
          />
          <ProfileStat
            label="months"
            value={breakdown.months}
          />
          <ProfileStat
            label="weeks"
            value={breakdown.weeks}
          />
        </div>
        {/* Glowing, single-row breakdown bar */}
        <div className="w-full flex justify-center mb-5">
          <GlowingLifetimeBar details={breakdown.details} />
        </div>
      </div>
      <div className="flex flex-row items-center gap-2 mb-7 justify-center">
        <MapPin color="#e8c282" size={21} />
        <span className="text-lg font-medium text-[#e8c282] lowercase">{LOCATION}</span>
      </div>
      <div className="w-full max-w-md mx-auto flex flex-col items-center mt-3">
        <div className="relative rounded-3xl border border-[#e8c28233] bg-[#1a1f2c]/80 text-[#edd6ae] text-center shadow-[0_0_25px_0_#e8c28215] px-10 py-8 mb-2">
          <div className="text-3xl md:text-4xl font-serif font-bold mb-1 tracking-tight lowercase" style={{ letterSpacing: "0.02em" }}>
            {format(now, "MMMM d, yyyy")}
          </div>
          <div className="uppercase text-base md:text-lg text-[#e8c282bb] tracking-widest mb-3 lowercase">{format(now, "EEEE")}</div>
          <div className="flex flex-col items-center justify-center w-full">
            <span className="block text-xs md:text-sm text-[#e8c282aa] font-medium mb-1 tracking-wide">
              time left today
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
