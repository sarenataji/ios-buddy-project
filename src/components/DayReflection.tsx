
import React, { useState } from 'react';
import { ThumbsUp, Smile, Meh } from 'lucide-react';
import { useToast } from "@/hooks/useToast";
import MoodFace from './MoodFace';
import { useFace } from '@/hooks/useFace';
import { Slider } from "@/components/ui/slider";

const DayReflection = () => {
  const [selectedMood, setSelectedMood] = useState<string>("OKAY");
  const [moodValue, setMoodValue] = useState([1]); // 0: BAD, 1: OKAY, 2: GOOD
  const { toast } = useToast();
  const { saveFace } = useFace();
  
  const handleMoodChange = (value: number[]) => {
    const moodIndex = value[0];
    let mood = "OKAY";
    
    if (moodIndex === 0) mood = "BAD";
    if (moodIndex === 2) mood = "GOOD";
    
    setMoodValue(value);
    setSelectedMood(mood);
    saveFace(moodIndex, mood);
    
    toast({
      title: "Day Reflection",
      description: `You've marked today as ${mood.toLowerCase()}`,
      duration: 3000,
    });
  };

  const getMoodIcon = (mood: string) => {
    switch(mood) {
      case "GOOD":
        return <ThumbsUp className="text-[#e8c282]" />;
      case "OKAY":
        return <Smile className="text-[#7e5a39]" />;
      case "BAD":
        return <Meh className="text-[#2a180f]" />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-card/90 border border-[#e8c28233] shadow-xl rounded-2xl overflow-hidden">
        <div className="p-4 bg-[#1a0c05] text-[#edd6ae] text-center">
          <h3 className="font-serif text-xl tracking-wide text-[#e8c282]">Daily Reflection</h3>
        </div>
        
        <div className="p-4 flex flex-col items-center">
          <div className="w-full h-[350px] mb-6">
            <MoodFace mood={selectedMood} moodValue={moodValue[0]} />
          </div>
          
          <div className="w-full px-4 py-6">
            <Slider
              defaultValue={[1]}
              max={2}
              step={0.01}
              value={moodValue}
              onValueChange={handleMoodChange}
              className="w-full"
            />
            
            <div className="flex justify-between mt-4 px-2">
              <div className="flex flex-col items-center">
                {getMoodIcon("BAD")}
                <span className="text-sm text-[#2a180f] mt-1">Bad</span>
              </div>
              <div className="flex flex-col items-center">
                {getMoodIcon("OKAY")}
                <span className="text-sm text-[#7e5a39] mt-1">Okay</span>
              </div>
              <div className="flex flex-col items-center">
                {getMoodIcon("GOOD")}
                <span className="text-sm text-[#e8c282] mt-1">Good</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayReflection;
