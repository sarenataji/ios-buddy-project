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

// Updated: Single-line, nicely spaced breakdown
function formatLifetime(details: {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}) {
  return (
    <div className="inline-flex flex-row flex-wrap items-center justify-center gap-4 w-full text-center">
      <span>
        <span className="font-bold">{details.years}</span>y
      </span>
      <span>
        <span className="font-bold">{details.months}</span>m
      </span>
      <span>
        <span className="font-bold">{details.weeks}</span>w
      </span>
      <span>
        <span className="font-bold">{details.days}</span>d
      </span>
      <span>
        <span className="font-bold">{details.hours}</span>h
      </span>
      <span>
        <span className="font-bold">{details.minutes}</span>m
      </span>
      <span>
        <span className="font-bold">{details.seconds}</span>s
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
        {/* Always-visible breakdown bar, one row */}
        <div className="w-full flex justify-center mb-5">
          <div
            className="px-8 py-4 rounded-2xl bg-[#191a19]/80 border border-[#e8c28233] text-[#ecd7a8] text-lg md:text-xl font-medium shadow-[0_0_18px_0_#e8c28211] backdrop-blur-sm text-center animate-fade-in"
            style={{ maxWidth: 900, fontFamily: "Inter, system-ui, sans-serif", letterSpacing: "0.02em" }}
          >
            {formatLifetime(breakdown.details)}
          </div>
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
