
import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ThumbsUp, Smile, Meh, ThumbsDown } from 'lucide-react';
import * as THREE from 'three';
import { Toast } from "@/components/ui/toast";
import { useToast } from "@/hooks/useToast";

const MOOD_COLORS = {
  GOOD: '#e8c282', // Gold
  OKAY: '#7e5a39', // Medium brown
  BAD: '#2a180f',  // Dark brown
};

function ReflectionSphere({ mood, onClick }: { mood: string | null, onClick: (selected: string) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Gentle floating animation
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    
    // Subtle rotation
    meshRef.current.rotation.y += 0.003;
    meshRef.current.rotation.x += 0.001;

    // Scale effect when active
    if (active) {
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1.2, 0.1);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1.2, 0.1);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1.2, 0.1);
    } else if (hovered) {
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1.1, 0.1);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1.1, 0.1);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1.1, 0.1);
    } else {
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, 1, 0.1);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1, 0.1);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, 1, 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={() => {
        setActive(true);
        onClick(mood as string);
      }}
      onPointerUp={() => setActive(false)}
      position={[0, 0, 0]}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial 
        color={mood ? MOOD_COLORS[mood as keyof typeof MOOD_COLORS] : "#7e5a39"}
        roughness={0.3}
        metalness={0.7}
        emissive={hovered ? MOOD_COLORS[mood as keyof typeof MOOD_COLORS] : "#000"}
        emissiveIntensity={hovered ? 0.3 : 0}
      />
    </mesh>
  );
}

function ReflectionOrbs({ selectedMood, onMoodSelect }: { selectedMood: string | null, onMoodSelect: (mood: string) => void }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!groupRef.current) return;
    // Gentle rotation of the whole group
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
  });

  const moods = ["GOOD", "OKAY", "BAD"];
  
  return (
    <group ref={groupRef}>
      {moods.map((mood, i) => {
        const angle = (i * Math.PI * 2) / 3;
        const radius = 2;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        return (
          <group key={mood} position={[x, 0, z]}>
            <ReflectionSphere mood={mood} onClick={onMoodSelect} />
            <pointLight 
              position={[0, 0.5, 0]} 
              color={MOOD_COLORS[mood as keyof typeof MOOD_COLORS]}
              intensity={selectedMood === mood ? 5 : 2}
              distance={3}
              decay={2}
            />
          </group>
        );
      })}
      {/* Ambient light for overall scene illumination */}
      <ambientLight intensity={0.4} />
    </group>
  );
}

const MoodIcon = ({ mood }: { mood: string | null }) => {
  if (!mood) return null;
  
  switch(mood) {
    case "GOOD":
      return <ThumbsUp className="text-[#e8c282]" />;
    case "OKAY":
      return <Smile className="text-[#7e5a39]" />;
    case "BAD":
      return <ThumbsDown className="text-[#2a180f]" />;
    default:
      return null;
  }
};

const DayReflection = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { toast } = useToast();
  
  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    toast({
      title: "Day Reflection",
      description: `You've marked today as ${mood.toLowerCase()}`,
      duration: 3000,
    });
    
    // Here you could save the reflection to your state management system or database
  };

  const getMoodTitle = () => {
    if (!selectedMood) return "How was your day?";
    return `Your day was ${selectedMood.toLowerCase()}`;
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-card/90 border border-[#e8c28233] shadow-xl rounded-2xl overflow-hidden">
        <div className="p-4 bg-[#1a0c05] text-[#edd6ae] text-center">
          <h3 className="font-serif text-xl tracking-wide text-[#e8c282]">Daily Reflection</h3>
        </div>
        
        <div className="p-4 flex flex-col items-center">
          <div className="w-full h-[350px] rounded-lg overflow-hidden relative mb-4">
            <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
              <ReflectionOrbs selectedMood={selectedMood} onMoodSelect={handleMoodSelect} />
            </Canvas>
            
            {/* Overlay instructions/info */}
            <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center pointer-events-none">
              <div className="bg-[#0c0a08]/80 text-[#edd6ae] px-6 py-3 rounded-full backdrop-blur-sm border border-[#e8c28233] shadow-[0_0_15px_0_#e8c28222] flex items-center gap-3">
                <span className="font-serif">{getMoodTitle()}</span>
                {selectedMood && <MoodIcon mood={selectedMood} />}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 w-full mt-2">
            {["GOOD", "OKAY", "BAD"].map((mood) => (
              <button
                key={mood}
                className={`py-2 px-4 rounded-lg font-['Inter'] text-sm tracking-wide transition-all duration-200 ${
                  selectedMood === mood 
                    ? 'bg-[#e8c282] text-[#1a0c05] shadow-[0_0_15px_0_#e8c28244]' 
                    : 'bg-[#1a0c05]/80 text-[#edd6ae] border border-[#e8c28233]'
                }`}
                onClick={() => handleMoodSelect(mood)}
              >
                {mood.toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayReflection;
