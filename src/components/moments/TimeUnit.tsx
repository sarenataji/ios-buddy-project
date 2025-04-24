
interface TimeUnitProps {
  value: number;
  unit: string;
}

const TimeUnit = ({ value, unit }: TimeUnitProps) => (
  <div className="flex flex-col items-center">
    <span className="text-3xl font-serif font-bold tracking-tight">
      {value.toString().padStart(2, '0')}
    </span>
    <span className="text-xs uppercase tracking-wider text-[#e8c28288] mt-1">
      {unit}
    </span>
  </div>
);

export default TimeUnit;
