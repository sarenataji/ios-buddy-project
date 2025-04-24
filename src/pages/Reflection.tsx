
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import DayReflection from '@/components/DayReflection';
import YearVisualizer from '@/components/YearVisualizer';

const Reflection = () => {
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
          {/* Hero section with 3D component */}
          <div className="w-full h-full flex flex-col items-center gap-6">
            <p className="text-center text-lg text-[#edd6ae] max-w-md">
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
