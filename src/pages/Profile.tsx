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
  dAfterHours.setHours(dAfterDays.getHours() + hours);

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
  const items = [
    { value: details.years, unit: "y" },
    { value: details.months, unit: "m" },
    { value: details.weeks, unit: "w" },
    { value: details.days, unit: "d" },
    { value: details.hours, unit: "h" },
    { value: details.minutes, unit: "m" },
    { value: details.seconds, unit: "s" },
  ];
  return (
    <div
      className="
        w-full
        flex flex-row items-center justify-center
        px-3 py-2
        rounded-[1.3rem]
        bg-[#18151d]/76
        border border-[#f2d6ad90]
        shadow-[0_0_20px_2px_#e8c28244,0_2px_8px_0_#99774a22]
        animate-glow3d
        transition-all
        backdrop-blur-[3px]
        mx-auto
        relative
        overflow-visible
      "
      style={{
        maxWidth: 540,
        minHeight: "36px",
        fontFamily: "Inter,sans-serif",
        fontSize: "1.01rem",
        letterSpacing: "0.07em",
        borderWidth: 1.1,
        boxShadow: `
          0 0 12px 2px #EDD6AED0,
          0 0 22px 4px #e8c28231,
          0 0 30px 4px #b1915455,
          0 0 0px 1px #edd6ae50 inset
        `,
        animation: "glowPulse 1.4s ease-in-out infinite alternate"
      }}
    >
      <style>{`
      @keyframes glowPulse {
        0% {
          box-shadow:
            0 0 8px 2px #EDD6AE90,
            0 0 15px 4px #e8c28211,
            0 0 30px 4px #b1915411,
            0 0 0px 1px #edd6ae50 inset;
        }
        100% {
          box-shadow:
            0 0 20px 5px #e5cfadAA,
            0 0 35px 8px #e8c28233,
            0 0 44px 10px #b1915477,
            0 0 0px 1px #edd6ae80 inset;
        }
      }
      `}</style>
      <span className="flex flex-row items-center justify-center gap-x-4 w-full">
        {items.map((entry, i) => (
          <span
            key={entry.unit + i}
            className={`
              flex flex-row items-baseline
              text-[#dec897]
              font-extralight
              text-[1.03rem] md:text-[1.10rem]
              select-none
              whitespace-nowrap
              drop-shadow-[0_1px_1px_#7e5a3937]
              px-[3px]
              leading-tight
              ${i === 0 ? "pl-1" : ""}
              ${i === items.length - 1 ? "pr-1" : ""}
            `}
            style={{
              fontWeight: i <= 2 ? 500 : 300,
              fontFamily: "Inter, system-ui, sans-serif"
            }}
          >
            <span
              className={`
                ${i <= 2 ? "font-semibold text-[#ecd6ae]" : "font-light text-[#edceaebb]"}
                px-[0.5px]
                mr-px
              `}
              style={{ fontWeight: i <= 2 ? 500 : 300 }}
            >
              {entry.value}
            </span>
            <span
              className={`
                text-[0.98rem] md:text-[1.03rem]
                font-thin
                text-[#ecd6aeac]
                pl-0.5
              `}
              style={{ fontWeight: 300 }}
            >
              {entry.unit}
            </span>
            {i < items.length - 1 && (
              <span className="mx-1 text-[#ecd6ae55] text-[1.2rem] font-light">·</span>
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
