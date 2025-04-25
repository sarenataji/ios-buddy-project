
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/useToast";
import MoodFace from './MoodFace';
import { useFace } from '@/hooks/useFace';

const DayReflection = () => {
  const [selectedMood, setSelectedMood] = useState<string>("OKAY");
  const [moodValue, setMoodValue] = useState([1]); // 0: GOOD, 1: OKAY, 2: BAD
  const [showSubmit, setShowSubmit] = useState(false);
  const { toast } = useToast();
  const { saveFace } = useFace();
  
  const handleMoodChange = (value: number[]) => {
    setMoodValue(value);
    
    if (value[0] === 0) {
      setSelectedMood("GOOD");
    } else if (value[0] === 1) {
      setSelectedMood("OKAY");
    } else {
      setSelectedMood("BAD");
    }
    
    setShowSubmit(true);
  };

  const handleSubmit = () => {
    saveFace(moodValue[0], selectedMood);
    
    toast({
      title: "Day Reflection",
      description: `Your ${selectedMood.toLowerCase()} mood has been saved`,
      duration: 3000,
    });
    
    setShowSubmit(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="p-6 flex flex-col items-center">
        {/* Face Container */}
        <div className="w-full aspect-square max-w-[400px] mb-8">
          <MoodFace mood={selectedMood} moodValue={moodValue[0]} />
        </div>
        
        {/* Mood Selection Slider */}
        <div className="w-full max-w-md px-6 py-6 bg-[#1a0c0580] rounded-xl backdrop-blur-sm mt-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[#4caf50] text-sm font-semibold tracking-[0.2em]">GOOD</span>
            <span className="text-[#e8c282] text-sm font-semibold tracking-[0.2em]">OKAY</span>
            <span className="text-[#ff5252] text-sm font-semibold tracking-[0.2em]">BAD</span>
          </div>
          
          <div className="mb-6">
            <Slider
              defaultValue={[1]}
              value={moodValue}
              onValueChange={handleMoodChange}
              max={2}
              step={1}
              className="[&_.Slider-track]:bg-[#2a180f] [&_.Slider-range]:bg-[#e8c282]"
            />
          </div>
          
          {showSubmit && (
            <Button
              onClick={handleSubmit}
              className="w-full mt-6 bg-[#e8c282] text-[#1a0c05] hover:bg-[#e8c282]/90 transition-colors font-semibold tracking-wider"
            >
              Submit Reflection
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayReflection;
