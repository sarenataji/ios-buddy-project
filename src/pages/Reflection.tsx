import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import DayReflection from '@/components/DayReflection';
import YearVisualizer from '@/components/YearVisualizer';
import FaceSlider from '@/components/FaceSlider';
import SavedFacesHistory from '@/components/SavedFacesHistory';
import { useFace } from '@/hooks/useFace';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Reflection = () => {
  const { saveFace } = useFace();
  const [activeTab, setActiveTab] = useState<string>("faces");
  
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-[#1a0c05]/50 border border-[#e8c28233] mb-6">
            <TabsTrigger value="faces" className="flex-1 data-[state=active]:bg-[#7e5a39]/40 text-[#edd6ae]">
              Face Reflection
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex-1 data-[state=active]:bg-[#7e5a39]/40 text-[#edd6ae]">
              Mood Tracker
            </TabsTrigger>
            <TabsTrigger value="month" className="flex-1 data-[state=active]:bg-[#7e5a39]/40 text-[#edd6ae]">
              <CalendarIcon className="w-4 h-4 mr-1" />
              Month View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="faces" className="space-y-8">
            <div className="w-full h-full flex flex-col items-center gap-6">
              <div className="text-center max-w-md">
                <h2 className="text-center text-xl text-[#e8c282] font-serif">Face Reflection</h2>
                <p className="text-center text-sm text-[#edd6ae] opacity-80 mt-2">
                  Explore different facial expressions and moods. Swipe left or right to browse through them.
                </p>
              </div>
              
              <FaceSlider onSave={handleSaveFace} />
              
              <div className="w-full mt-6">
                <SavedFacesHistory />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="mood" className="space-y-8">
            <div className="w-full h-full flex flex-col items-center gap-6">
              <div className="text-center max-w-md">
                <h2 className="text-center text-xl text-[#e8c282] font-serif">Daily Mood</h2>
                <p className="text-center text-sm text-[#edd6ae] opacity-80 mt-2">
                  Take a moment to reflect on your day and track how your feelings change over time.
                </p>
              </div>
              
              <DayReflection />
            </div>
          </TabsContent>
          
          <TabsContent value="month" className="space-y-8">
            <div className="w-full h-full flex flex-col items-center gap-6">
              <div className="text-center max-w-md">
                <h2 className="text-center text-xl text-[#e8c282] font-serif">Month Overview</h2>
                <p className="text-center text-sm text-[#edd6ae] opacity-80 mt-2">
                  See your daily mood reflections throughout the month.
                </p>
              </div>
              
              <div className="w-full">
                <MonthView />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reflection;
