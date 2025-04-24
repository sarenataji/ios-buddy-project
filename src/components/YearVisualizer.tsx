import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { format, getDaysInYear, isAfter, isBefore, isSameDay, addDays } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
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
      // Subtle, elegant rotation
      ringRef.current.rotation.y += 0.001;
      // Gentle breathing effect
      const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      ringRef.current.scale.setScalar(1 + breathe);
    }
  });

  const radius = 3.5;
  const angleStep = (2 * Math.PI) / days.length;

  return (
    <group ref={ringRef}>
      {days.map((day, index) => {
        const angle = angleStep * index;
        const x = radius * Math.cos(angle);
        const z = radius * Math.sin(angle);
        const isPast = isBefore(day, today) && !isSameDay(day, today);
        const isToday = isSameDay(day, today);
        
        // Subtle wave effect
        const yOffset = Math.sin(angle * 2 + Date.now() * 0.0005) * 0.1;
        
        return (
          <mesh
            key={index}
            position={[x, yOffset, z]}
            scale={hoveredDay && isSameDay(hoveredDay, day) ? 0.12 : isToday ? 0.1 : 0.06}
            onPointerOver={() => setHoveredDay(day)}
            onPointerOut={() => setHoveredDay(null)}
          >
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial 
              color={isToday ? '#e8c282' : isPast ? '#2a180f' : '#edd6ae'}
              emissive={hoveredDay && isSameDay(hoveredDay, day) ? '#e8c282' : isToday ? '#e8c282' : '#000000'}
              emissiveIntensity={hoveredDay && isSameDay(hoveredDay, day) ? 0.5 : isToday ? 0.3 : 0.1}
              metalness={0.7}
              roughness={0.3}
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
      // Subtle tilt animation
      sceneRef.current.rotation.x = Math.PI / 4 + Math.sin(state.clock.elapsedTime * 0.2) * 0.03;
    }
  });

  return (
    <group ref={sceneRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.6} />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.4}
        color="#e8c282"
      />
      <TimeRing days={days} today={today} hoveredDay={hoveredDay} setHoveredDay={setHoveredDay} />
    </group>
  );
}

const YearVisualizer = ({ year = new Date().getFullYear() }: YearVisualizerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const today = new Date();

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
  const progress = ((daysInYear.length - daysLeft) / daysInYear.length) * 100;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="mt-6 flex items-center justify-center gap-2 px-6 py-2 rounded-xl 
          bg-[#1a1f2c]/90 border border-[#e8c28244] hover:bg-[#1a1f2c] 
          text-[#e8c282] text-sm tracking-wide transition-all duration-200
          shadow-[0_0_15px_0_#e8c28222] hover:shadow-[0_0_20px_0_#e8c28233]
          font-['Inter']"
      >
        <Calendar className="w-4 h-4" />
        <span>Year View</span>
      </button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-[#0c0a08] border-none p-0 max-w-[800px] max-h-[90vh] overflow-hidden rounded-3xl
          shadow-[0_0_50px_0_#e8c28215]">
          <DialogTitle className="sr-only">Year Visualizer</DialogTitle>
          <div className="w-full h-full flex flex-col">
            <div className="relative h-[500px] bg-gradient-to-b from-[#0c0a08] to-[#12100e]">
              <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
                <Scene 
                  days={daysInYear} 
                  today={today} 
                  hoveredDay={hoveredDate}
                  setHoveredDay={setHoveredDate}
                />
              </Canvas>
              
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
                <div className="w-64 bg-[#1a1f2c]/60 rounded-full p-1.5 backdrop-blur-sm border border-[#e8c28222]">
                  <div 
                    className="h-1 rounded-full bg-gradient-to-r from-[#e8c282] to-[#d4af6b] transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-[#e8c282]/60 text-sm tracking-wider font-light">
                  {Math.round(progress)}% of {year} completed
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 items-center text-[#e8c282] p-6 bg-[#0c0a08] backdrop-blur-sm">
              <div className="text-lg tracking-wide text-center">
                {hoveredDate ? (
                  <span className="flex flex-col items-center gap-1">
                    <span className="text-2xl font-serif">{format(hoveredDate, "MMMM d")}</span>
                    <span className="text-sm opacity-75 font-['Inter']">{format(hoveredDate, "EEEE, yyyy")}</span>
                  </span>
                ) : (
                  <span className="text-2xl font-serif">{year}</span>
                )}
              </div>
              <div className="text-sm opacity-80 tracking-wider font-light font-['Inter']">
                {daysLeft} days remaining in {year}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default YearVisualizer;
