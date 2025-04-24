
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import DayReflection from '@/components/DayReflection';
import YearVisualizer from '@/components/YearVisualizer';
import FaceSlider from '@/components/FaceSlider';
import SavedFacesHistory from '@/components/SavedFacesHistory';
import { useFace } from '@/hooks/useFace';

const Reflection = () => {
  const { saveFace } = useFace();
  
  const handleSaveFace = (faceIndex: number, mood: string) => {
    saveFace(faceIndex, mood);
  };
  
  return (
    <div className="min-h-screen w-full bg-background py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" asChild className="flex items-center gap-1 text-[#e8c282]">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft size={18} />
              <span>Back home</span>
            </Link>
          </Button>
          <h1 className="font-serif text-2xl text-primary-foreground">Reflection</h1>
          <div className="w-24"></div> {/* Placeholder for balance */}
        </div>

        <div className="space-y-8">
          {/* Face Slider Section */}
          <div className="w-full h-full flex flex-col items-center gap-6">
            <h2 className="text-center text-xl text-[#e8c282] font-serif">Face Reflection</h2>
            <p className="text-center text-sm text-[#edd6ae] opacity-80 max-w-md">
              Explore different facial expressions and moods. Swipe left or right to browse through them.
            </p>
            
            <FaceSlider onSave={handleSaveFace} />
            
            <div className="w-full mt-6">
              <SavedFacesHistory />
            </div>
          </div>
          
          {/* Separator */}
          <div className="w-full h-px bg-[#e8c28233]"></div>
          
          {/* Original Day Reflection Section */}
          <div className="w-full h-full flex flex-col items-center gap-6">
            <h2 className="text-center text-xl text-[#e8c282] font-serif">Daily Mood</h2>
            <p className="text-center text-sm text-[#edd6ae] opacity-80 max-w-md">
              Take a moment to reflect on your day and track how your feelings change over time.
            </p>
            
            <DayReflection />
            
            <div className="w-full flex justify-center mt-4">
              <YearVisualizer year={new Date().getFullYear()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reflection;
