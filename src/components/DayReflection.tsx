
import React, { useState } from 'react';
import { ThumbsUp, Smile, Meh } from 'lucide-react';
import { useToast } from "@/hooks/useToast";
import MoodFace from './MoodFace';
import { useFace } from '@/hooks/useFace';

const DayReflection = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { toast } = useToast();
  const { saveFace } = useFace();
  
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    saveFace(getMoodIndex(mood), mood);
    toast({
      title: "Day Reflection",
      description: `You've marked today as ${mood.toLowerCase()}`,
      duration: 3000,
    });
  };

  const getMoodIndex = (mood: string): number => {
    switch(mood) {
      case "GOOD": return 0;
      case "OKAY": return 1;
      case "BAD": return 2;
      default: return 1;
    }
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
          <MoodFace mood={selectedMood} />
          
          <div className="grid grid-cols-3 gap-3 w-full mt-6">
            {["GOOD", "OKAY", "BAD"].map((mood) => (
              <button
                key={mood}
                className={`py-4 px-4 rounded-lg font-['Inter'] transition-all duration-200 flex flex-col items-center gap-2 ${
                  selectedMood === mood 
                    ? 'bg-[#e8c282] text-[#1a0c05] shadow-[0_0_15px_0_#e8c28244]' 
                    : 'bg-[#1a0c05]/80 text-[#edd6ae] border border-[#e8c28233] hover:bg-[#1a0c05]'
                }`}
                onClick={() => handleMoodSelect(mood)}
              >
                {getMoodIcon(mood)}
                <span className="text-sm tracking-wide">{mood.toLowerCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayReflection;
