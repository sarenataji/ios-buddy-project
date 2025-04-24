
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useToast } from "@/hooks/useToast";

// Face data - would be replaced with actual face vectors in a real implementation
const FACE_DATA = [
  { id: 1, vector: new THREE.Vector3(0, 0, 0), mood: "Calm" },
  { id: 2, vector: new THREE.Vector3(0.2, 0.1, 0.05), mood: "Happy" },
  { id: 3, vector: new THREE.Vector3(-0.2, -0.1, 0), mood: "Reflective" },
  { id: 4, vector: new THREE.Vector3(0.1, -0.2, 0.1), mood: "Focused" },
];

interface FaceSliderProps {
  onSave?: (faceIndex: number, mood: string) => void;
}

function Face({ blendedVector }: { blendedVector: THREE.Vector3 }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Add subtle animation to the face
    meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
    
    // This would be where we'd update the face geometry based on the blendedVector
    // For demo, we'll just slightly modify the geometry
    const scale = 1 + Math.sin(state.clock.getElapsedTime()) * 0.02;
    meshRef.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={meshRef}>
      {/* In a real implementation, this would be a detailed face mesh */}
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial 
        color="#e8c282" 
        roughness={0.3} 
        metalness={0.7}
        emissive="#7e5a39"
        emissiveIntensity={0.2}
      />
      {/* Facial features would be added here in a real implementation */}
      <group position={[0, 0.25, 1.4]}>
        {/* Eyes */}
        <mesh position={[-0.3, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#2a180f" />
        </mesh>
        <mesh position={[0.3, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#2a180f" />
        </mesh>
        {/* Mouth */}
        <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI * 0.1]}>
          <torusGeometry args={[0.2, 0.05, 16, 16, Math.PI]} />
          <meshBasicMaterial color="#2a180f" />
        </mesh>
      </group>
    </mesh>
  );
}

function FaceRenderer({ 
  currentIndex, 
  slideProgress 
}: { 
  currentIndex: number, 
  slideProgress: number 
}) {
  // Get current and next/prev face vector based on slide direction
  const direction = Math.sign(slideProgress);
  const targetIndex = Math.max(0, Math.min(currentIndex + direction, FACE_DATA.length - 1));
  
  const faceA = FACE_DATA[currentIndex].vector;
  const faceB = FACE_DATA[targetIndex].vector;
  
  // Interpolate between face vectors
  const t = Math.abs(slideProgress);
  const blendedVector = new THREE.Vector3().lerpVectors(faceA, faceB, t);
  
  return (
    <group>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.6} />
      <Face blendedVector={blendedVector} />
    </group>
  );
}

const FaceSlider: React.FC<FaceSliderProps> = ({ onSave }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideProgress, setSlideProgress] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [startX, setStartX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Animation ref for smooth transitions
  const animationRef = useRef<number | null>(null);
  
  // Handle touch/mouse down
  const handleStart = (clientX: number) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setStartX(clientX);
    setIsSliding(true);
  };
  
  // Handle touch/mouse move
  const handleMove = (clientX: number) => {
    if (!isSliding) return;
    
    const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
    const deltaX = clientX - startX;
    const progress = Math.max(-1, Math.min(1, deltaX / (containerWidth * 0.5)));
    
    setSlideProgress(progress);
  };
  
  // Handle touch/mouse up
  const handleEnd = () => {
    if (!isSliding) return;
    
    const threshold = 0.3;
    if (Math.abs(slideProgress) > threshold) {
      const direction = Math.sign(slideProgress);
      const newIndex = Math.max(0, Math.min(currentIndex + direction, FACE_DATA.length - 1));
      
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        
        // Save the selected face
        onSave?.(newIndex, FACE_DATA[newIndex].mood);
        toast({
          title: "Face Selected",
          description: `You selected: ${FACE_DATA[newIndex].mood}`,
          duration: 3000,
        });
      }
    }
    
    // Animate back to center
    animateToCenter();
  };
  
  // Animate the face back to center after sliding
  const animateToCenter = () => {
    const startProgress = slideProgress;
    const startTime = Date.now();
    const duration = 300; // ms
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out cubic
      const t = 1 - Math.pow(1 - progress, 3);
      setSlideProgress(startProgress * (1 - t));
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setSlideProgress(0);
        setIsSliding(false);
        animationRef.current = null;
      }
    };
    
    animate();
  };
  
  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Event handlers for mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };
  
  const handleMouseUp = () => {
    handleEnd();
  };
  
  // Event handlers for touch
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    handleEnd();
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-[400px] bg-[#140D07] rounded-lg overflow-hidden relative"
      onMouseDown={handleMouseDown}
      onMouseMove={isSliding ? handleMouseMove : undefined}
      onMouseUp={handleMouseUp}
      onMouseLeave={isSliding ? handleMouseUp : undefined}
      onTouchStart={handleTouchStart}
      onTouchMove={isSliding ? handleTouchMove : undefined}
      onTouchEnd={handleTouchEnd}
    >
      {/* Canvas for the 3D face */}
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <FaceRenderer currentIndex={currentIndex} slideProgress={slideProgress} />
      </Canvas>
      
      {/* Overlay with instructions */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center pointer-events-none">
        <div className="bg-[#0c0a08]/80 text-[#edd6ae] px-6 py-3 rounded-full backdrop-blur-sm border border-[#e8c28233] shadow-[0_0_15px_0_#e8c28222]">
          <span className="font-serif">{FACE_DATA[currentIndex].mood}</span>
          <span className="text-xs block opacity-70 mt-1">Swipe to explore different moods</span>
        </div>
      </div>
      
      {/* Progress indicator dots */}
      <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2">
        {FACE_DATA.map((face, index) => (
          <div 
            key={face.id}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-[#e8c282] scale-125' 
                : 'bg-[#7e5a39]/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default FaceSlider;
