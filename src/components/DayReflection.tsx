
import React, { useState, useEffect } from 'react';
import { ThumbsUp, Smile, Frown } from 'lucide-react';
import { useToast } from "@/hooks/useToast";
import MoodFace from './MoodFace';
import { useFace } from '@/hooks/useFace';
import { Slider } from "@/components/ui/slider";

const DayReflection = () => {
  const [selectedMood, setSelectedMood] = useState<string>("OKAY");
  const [moodValue, setMoodValue] = useState([1]); // 0: BAD, 1: OKAY, 2: GOOD
  const [moodLabel, setMoodLabel] = useState("Okay");
  const { toast } = useToast();
  const { saveFace } = useFace();
  
  const handleMoodChange = (value: number[]) => {
    const moodIndex = value[0];
    let mood = "OKAY";
    let label = "Okay";
    
    if (moodIndex < 0.33) {
      mood = "BAD";
      label = "Bad";
    } else if (moodIndex < 1.67) {
      mood = "OKAY";
      label = "Okay";
    } else {
      mood = "GOOD";
      label = "Good";
    }
    
    setMoodValue(value);
    setSelectedMood(mood);
    setMoodLabel(label);
    saveFace(moodIndex, mood);
    
    toast({
      title: "Day Reflection",
      description: `You've marked today as ${label.toLowerCase()}`,
      duration: 3000,
    });
  };

  const getMoodIcon = (mood: string) => {
    switch(mood) {
      case "GOOD":
        return <ThumbsUp className="text-[#4caf50]" />;
      case "OKAY":
        return <Smile className="text-[#e8c282]" />;
      case "BAD":
        return <Frown className="text-[#ff5252]" />;
      default:
        return null;
    }
  };

  // Color based on mood
  const getMoodColor = () => {
    if (moodValue[0] <= 0.5) return "text-[#ff5252]"; // Bad
    if (moodValue[0] >= 1.5) return "text-[#4caf50]"; // Good
    return "text-[#e8c282]"; // Okay
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-card/90 border border-[#e8c28233] shadow-xl rounded-2xl overflow-hidden">
        <div className="p-4 bg-[#1a0c05] text-[#edd6ae] text-center">
          <h3 className="font-serif text-xl tracking-wide text-[#e8c282]">Daily Reflection</h3>
        </div>
        
        <div className="p-6 flex flex-col items-center bg-gradient-to-b from-[#140D07] to-[#1a0c05]">
          <div className="w-full h-[300px] mb-4 relative">
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-500 z-10 ${getMoodColor()}`}>
              <h2 className="text-5xl font-bold tracking-wide opacity-20">{moodLabel.toUpperCase()}</h2>
            </div>
            <MoodFace mood={selectedMood} moodValue={moodValue[0]} />
          </div>
          
          <div className="w-full px-4 py-6 bg-[#1a0c0580] rounded-xl">
            <div className="w-full mb-1 flex justify-between items-center">
              <span className="text-[#ff5252] text-sm">Bad</span>
              <span className={`text-xl font-bold ${getMoodColor()}`}>{moodLabel}</span>
              <span className="text-[#4caf50] text-sm">Good</span>
            </div>
            
            <Slider
              defaultValue={[1]}
              max={2}
              step={0.01}
              value={moodValue}
              onValueChange={handleMoodChange}
              className="mt-2 mb-4"
            />
            
            <div className="flex justify-between mt-6 px-2">
              <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform" 
                   onClick={() => handleMoodChange([0])}>
                {getMoodIcon("BAD")}
                <span className="text-sm text-[#ff5252] mt-1">Bad</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                   onClick={() => handleMoodChange([1])}>
                {getMoodIcon("OKAY")}
                <span className="text-sm text-[#e8c282] mt-1">Okay</span>
              </div>
              <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                   onClick={() => handleMoodChange([2])}>
                {getMoodIcon("GOOD")}
                <span className="text-sm text-[#4caf50] mt-1">Good</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayReflection;
