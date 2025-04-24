
import React, { useEffect, useState } from "react";
import { format, differenceInYears, differenceInMonths, differenceInWeeks, differenceInDays, differenceInHours, differenceInMinutes, differenceInSeconds, endOfDay, intervalToDuration } from "date-fns";
import { MapPin } from "lucide-react";
import ProfileStat from "@/components/ProfileStat";
import ProfileSettings from "@/components/ProfileSettings";
import YearVisualizer from "@/components/YearVisualizer";

const initialState = {
  birthdate: new Date(1996, 8, 23, 0, 0, 0),
  nickname: "sarena ortega",
  quote: "don't count the days, make the days count. time wasted is life wasted.",
  location: "antalya, turkey"
};

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
    { value: details.seconds, unit: "s" }
  ];
  
  return (
    <div className="w-full flex justify-center mt-6">
      <div
        className="
          flex flex-row flex-wrap justify-center items-center
          px-3 py-1.5
          rounded-2xl
          border border-[#d9c49636]
          bg-[#161213]/80
          shadow-[0_0_24px_0_#ead49f66,0_2px_8px_0_#dbc7a944]
          mx-auto
          relative
          overflow-visible
          animate-lifetime-glow
          min-h-8
          gap-x-2 gap-y-2
          max-w-[468px]
        "
        style={{
          width: "100%",
          minHeight: "34px",
          fontFamily: "'Inter',sans-serif",
          fontSize: "0.92rem",
          letterSpacing: "0.07em",
          borderWidth: 1.2,
          boxShadow: `
            0 0 8px 1px #EDD6AE80,
            0 0 12px 2px #f2e5ca52,
            0 0 36px 8px #edd6ae66,
            0 0 0px 1px #edd6ae22 inset
          `,
          animation: "lifetimeGlow 2.1s cubic-bezier(.57,.8,.46,1.12) infinite alternate",
        }}
      >
        <style>{`
        @keyframes lifetimeGlow {
          0% {
            box-shadow:
              0 0 8px 1px #EDD6AE52,
              0 0 18px 3px #e8c28218,
              0 0 20px 4px #b1915414,
              0 0 0px 1px #edd6ae30 inset;
          }
          100% {
            box-shadow:
              0 0 18px 3px #e5cfada0,
              0 0 36px 8px #e8c28233,
              0 0 44px 12px #b1915477,
              0 0 0px 1px #edd6ae66 inset;
          }
        }
        `}</style>
        <span className="flex flex-row flex-wrap items-center justify-center w-full gap-x-1 gap-y-1">
          {items.map((entry, i) => (
            <span
              key={entry.unit + i}
              className={`
                flex flex-row items-baseline
                font-light
                text-[#eedaad]
                text-[0.92rem] md:text-[0.96rem]
                whitespace-nowrap
                select-none
                px-[2px]
                leading-tight
                ${i === 0 ? "pl-1" : ""}
                ${i === items.length - 1 ? "pr-1" : ""}
              `}
              style={{
                fontWeight: i <= 2 ? 400 : 300,
                fontFamily: "'Inter', system-ui, sans-serif",
                letterSpacing: "0.04em",
                lineHeight: "1.20",
              }}
            >
              <span
                className={`
                  text-[1.06em]
                  ${i <= 2 ? "font-medium text-[#ecd6ae]" : "font-light text-[#edceaebb]"}
                  px-[0.5px]
                  mr-px
                `}
                style={{ fontWeight: i <= 2 ? 400 : 300 }}
              >
                {entry.value}
              </span>
              <span
                className={`
                  text-[0.97em]
                  font-thin
                  text-[#ecd6aeaa]
                  pl-0.5
                `}
                style={{ fontWeight: 300 }}
              >
                {entry.unit}
              </span>
              {i < items.length - 1 && (
                <span className="mx-1 text-[#ecd6ae44] text-[1.18em] font-extralight" style={{fontWeight:200}}>·</span>
              )}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

const Profile = () => {
  const [profileData, setProfileData] = useState(initialState);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const breakdown = getBreakdown(profileData.birthdate, now);
  const countdown = getTimeLeftTillEndOfDay(now);

  const formatCountdown = (h: number, m: number, s: number) =>
    [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");

  const handleProfileUpdate = (data: Partial<typeof profileData>) => {
    setProfileData(prev => ({
      ...prev,
      ...data
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 pb-12 pt-8 relative">
      <ProfileSettings
        nickname={profileData.nickname}
        quote={profileData.quote}
        location={profileData.location}
        birthdate={profileData.birthdate}
        onUpdate={handleProfileUpdate}
      />
      <div className="uppercase tracking-widest text-sm mb-2 text-[#e8c282] text-center" style={{ letterSpacing: "0.22em" }}>profile</div>
      <div className="font-serif text-5xl md:text-6xl font-bold text-[#edd6ae] mb-1 tracking-wide text-center drop-shadow-md">{profileData.nickname}</div>
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
        "{profileData.quote}"
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
        <span className="text-lg font-medium text-[#e8c282] lowercase">{profileData.location}</span>
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
        
        {/* Add the Year Visualizer component */}
        <YearVisualizer year={2025} />
      </div>
    </div>
  );
};

export default Profile;
