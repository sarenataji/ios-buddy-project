
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import MoodFace from './MoodFace';
import { useFace } from '@/hooks/useFace';

const DayReflection = () => {
  const [selectedMood, setSelectedMood] = useState<string>("OKAY");
  const [moodValue, setMoodValue] = useState([1]); // 0: GOOD, 1: OKAY, 2: BAD
  const [showSubmit, setShowSubmit] = useState(false);
  const { toast } = useToast();
  const { saveFace } = useFace();
  
  const handleMoodSelect = (value: number[], mood: string) => {
    setMoodValue(value);
    setSelectedMood(mood);
    setShowSubmit(true);
  };

  const handleSubmit = () => {
    const moodIndex = moodValue[0];
    saveFace(moodIndex, selectedMood);
    
    toast({
      title: "Day Reflection",
      description: `Your ${selectedMood.toLowerCase()} mood has been saved`,
      duration: 3000,
    });
    
    setShowSubmit(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-card/90 border border-[#e8c28233] shadow-xl rounded-2xl overflow-hidden">
        <div className="p-4 bg-[#1a0c05] text-[#edd6ae] text-center">
          <h3 className="font-serif text-xl tracking-wide text-[#e8c282]">Daily Reflection</h3>
        </div>
        
        <div className="p-6 flex flex-col items-center bg-gradient-to-b from-[#140D07] to-[#1a0c05] relative">
          {/* Face Container with 3D Effect - With reliable fallback */}
          <div className="w-full h-[400px] mb-4 relative overflow-visible">
            {/* Background Mood Text */}
            <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden">
              <h2 className="text-8xl font-bold tracking-[0.3em] font-sans text-[#e8c28215] transition-all duration-500">
                {selectedMood}
              </h2>
            </div>
            
            {/* Face Container with Pop-out Effect */}
            <div className="absolute inset-0 flex items-center justify-center z-10 overflow-visible">
              <div className="relative w-full max-w-[320px] h-[320px] overflow-visible">
                {/* Ambient Glow */}
                <div className="absolute inset-[-20%] rounded-full bg-[#e8c28215] blur-2xl"></div>
                
                {/* Face Component with Fallback */}
                <div className="w-full h-full transform scale-125 overflow-visible">
                  <MoodFace mood={selectedMood} moodValue={moodValue[0]} />
                </div>
              </div>
            </div>
          </div>
          
          {/* Mood Selection Bar */}
          <div className="w-full px-6 py-8 bg-[#1a0c0580] rounded-xl backdrop-blur-sm mt-4 relative z-20">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[#4caf50] text-sm font-semibold tracking-[0.2em] cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleMoodSelect([0], "GOOD")}>GOOD</span>
              <span className="text-[#e8c282] text-sm font-semibold tracking-[0.2em] cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleMoodSelect([1], "OKAY")}>OKAY</span>
              <span className="text-[#ff5252] text-sm font-semibold tracking-[0.2em] cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleMoodSelect([2], "BAD")}>BAD</span>
            </div>
            
            {showSubmit && (
              <Button
                onClick={handleSubmit}
                className="w-full mt-4 bg-[#e8c282] text-[#1a0c05] hover:bg-[#e8c282]/90 transition-colors font-semibold tracking-wider"
              >
                Submit Reflection
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayReflection;
