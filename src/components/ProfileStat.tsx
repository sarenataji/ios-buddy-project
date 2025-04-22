
import React from "react";

type ProfileStatProps = {
  label: string;
  value: number | string;
  className?: string;
};

const ProfileStat: React.FC<ProfileStatProps> = ({
  label,
  value,
  className = "",
}) => {
  return (
    <div
      className={
        `flex-1 min-w-0 ${className}`
      }
    >
      <div
        className={`
          w-full
          flex flex-col items-center justify-center
          bg-[#1a1f2c]/85
          rounded-2xl border border-[#e8c28244]
          shadow-[0_0_30px_0_#e8c28215]
          py-7 select-none
          transition-all duration-150
          relative
          group
        `}
        tabIndex={0}
      >
        <div className="flex items-center justify-center gap-1 text-4xl md:text-5xl font-bold font-serif text-[#EDD6AE] mb-1 transition-all duration-75">
          {value}
        </div>
        <div className="uppercase text-[0.76rem] tracking-widest text-[#e8c282bb] font-medium">{label}</div>
      </div>
    </div>
  );
};

export default ProfileStat;

