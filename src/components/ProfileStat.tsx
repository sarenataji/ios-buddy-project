
import React from "react";

type ProfileStatProps = {
  label: string;
  value: number | string;
  className?: string;
};

const ProfileStat: React.FC<ProfileStatProps> = ({
  label,
  value,
  className = ""
}) => {
  return (
    <div className={`flex-1 min-w-0 ${className}`}>
      <div tabIndex={0} className="">
        <div className="flex items-center justify-center gap-1 text-4xl md:text-5xl font-bold font-serif text-[#EDD6AE] mb-1 transition-all duration-75 lowercase">
          {value}
        </div>
        <div className="uppercase text-[0.76rem] tracking-widest text-[#e8c282bb] font-medium lowercase">{label}</div>
      </div>
    </div>
  );
};

export default ProfileStat;
