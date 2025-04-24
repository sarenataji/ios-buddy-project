
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { format, getDaysInYear, isAfter, isBefore, isSameDay, addDays } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Canvas, useFrame, ThreeElements } from '@react-three/fiber';
import * as THREE from 'three';

interface YearVisualizerProps {
  year?: number;
}

function TimeRing({ days, today, hoveredDay, setHoveredDay }: { 
  days: Date[], 
  today: Date,
  hoveredDay: Date | null,
  setHoveredDay: (day: Date | null) => void
}) {
  const ringRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.001;
    }
  });

  const radius = 4;
  const angleStep = (2 * Math.PI) / days.length;

  return (
    <group ref={ringRef}>
      {days.map((day, index) => {
        const angle = angleStep * index;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        const isPast = isBefore(day, today) && !isSameDay(day, today);
        
        return (
          <mesh
            key={index}
            position={[x, 0, z]}
            scale={hoveredDay && isSameDay(hoveredDay, day) ? 0.15 : 0.1}
            onPointerOver={() => setHoveredDay(day)}
            onPointerOut={() => setHoveredDay(null)}
          >
            <sphereGeometry />
            <meshStandardMaterial 
              color={isPast ? '#2a180f' : '#edd6ae'}
              emissive={hoveredDay && isSameDay(hoveredDay, day) ? '#e8c282' : '#000000'}
              emissiveIntensity={0.5}
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

function Scene({ days, today, hoveredDay, setHoveredDay }: {
  days: Date[],
  today: Date,
  hoveredDay: Date | null,
  setHoveredDay: (day: Date | null) => void
}) {
  const sceneRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (sceneRef.current) {
      sceneRef.current.rotation.x = Math.PI / 4;
    }
  });

  return (
    <group ref={sceneRef}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <TimeRing days={days} today={today} hoveredDay={hoveredDay} setHoveredDay={setHoveredDay} />
    </group>
  );
}

const YearVisualizer = ({ year = new Date().getFullYear() }: YearVisualizerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const today = new Date();

  // Generate all days in the year
  const generateDaysInYear = (year: number) => {
    const daysInYear = getDaysInYear(new Date(year, 0, 1));
    const days: Date[] = [];
    
    for (let i = 0; i < daysInYear; i++) {
      days.push(addDays(new Date(year, 0, 1), i));
    }
    
    return days;
  };

  const daysInYear = generateDaysInYear(year);
  const daysLeft = daysInYear.filter(day => isAfter(day, today)).length;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-6 flex items-center justify-center gap-2 px-6 py-2 rounded-xl 
          bg-[#1a1f2c]/90 border border-[#e8c28244] hover:bg-[#1a1f2c] 
          text-[#e8c282] text-sm tracking-wide transition-all duration-200
          shadow-[0_0_15px_0_#e8c28222] hover:shadow-[0_0_20px_0_#e8c28233]"
      >
        <Calendar className="w-4 h-4" />
        <span>Year View</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="bg-[#000000] border-none p-0 max-w-[800px] max-h-[90vh] overflow-hidden rounded-3xl
            shadow-[0_0_50px_0_#e8c28215]"
        >
          <div className="w-full h-full flex flex-col">
            <div className="relative h-[500px]">
              <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
                <Scene 
                  days={daysInYear} 
                  today={today} 
                  hoveredDay={hoveredDate}
                  setHoveredDay={setHoveredDate}
                />
              </Canvas>
            </div>
            
            <div className="flex justify-between items-center text-[#e8c282] font-serif p-6 bg-[#00000080] backdrop-blur-sm">
              <div className="text-lg tracking-wide">
                {hoveredDate ? format(hoveredDate, "EEEE, MMMM d, yyyy") : year}
              </div>
              <div className="text-sm opacity-80 tracking-wider">
                {daysLeft} days left
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default YearVisualizer;
