
import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MoodFaceProps {
  mood: string;
  moodValue: number;
}

function Face({ moodValue }: { moodValue: number }) {
  const meshRef = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle breathing animation
      const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      meshRef.current.scale.setScalar(1 + breathe);
      
      // Subtle rotation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  // Get mood-specific configurations
  const getMoodConfig = () => {
    switch (moodValue) {
      case 0: // GOOD
        return {
          mouthCurveTop: Math.PI * 0.2,    // More pronounced upward curve for smile
          mouthCurveBottom: Math.PI * 0.2,  // Matching bottom curve
          mouthScale: 0.5,                  // Even wider for a big smile
          eyeScale: 1.2,                    // Larger, more excited eyes
          eyePosition: 0.05                 // Slight lift to show happiness
        };
      case 1: // OKAY
        return {
          mouthCurveTop: 0,                 // Straight line
          mouthCurveBottom: 0,              // Straight line
          mouthScale: 0.35,                 // Normal width
          eyeScale: 1,                      // Normal eyes
          eyePosition: 0                    // Neutral position
        };
      case 2: // BAD
        return {
          mouthCurveTop: -Math.PI * 0.2,    // More pronounced downward curve for frown
          mouthCurveBottom: -Math.PI * 0.2,  // Matching bottom curve
          mouthScale: 0.25,                  // Smaller, tighter mouth
          eyeScale: 0.7,                     // Smaller, more closed eyes
          eyePosition: -0.05                 // Slight drop to show sadness
        };
      default:
        return {
          mouthCurveTop: 0,
          mouthCurveBottom: 0,
          mouthScale: 0.35,
          eyeScale: 1,
          eyePosition: 0
        };
    }
  };

  const config = getMoodConfig();

  return (
    <group ref={meshRef}>
      {/* Main face sphere */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#e8c282"
          metalness={0.2}
          roughness={0.3}
        />
      </mesh>

      {/* Left Eye */}
      <mesh position={[-0.3, 0.2 + config.eyePosition, 0.85]} scale={[0.12 * config.eyeScale, 0.12 * config.eyeScale, 0.12]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#2a180f" />
      </mesh>

      {/* Right Eye */}
      <mesh position={[0.3, 0.2 + config.eyePosition, 0.85]} scale={[0.12 * config.eyeScale, 0.12 * config.eyeScale, 0.12]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#2a180f" />
      </mesh>

      {/* Mouth (combination of curves for more expressiveness) */}
      <group position={[0, -0.1, 0.85]}>
        {/* Top curve of mouth */}
        <mesh rotation={[0, 0, config.mouthCurveTop]} position={[0, 0.02, 0]}>
          <torusGeometry args={[config.mouthScale, 0.05, 16, 16, Math.PI]} />
          <meshBasicMaterial color="#2a180f" />
        </mesh>
        
        {/* Bottom curve of mouth */}
        <mesh rotation={[0, 0, config.mouthCurveBottom]} position={[0, -0.02, 0]}>
          <torusGeometry args={[config.mouthScale, 0.05, 16, 16, Math.PI]} />
          <meshBasicMaterial color="#2a180f" />
        </mesh>
      </group>
    </group>
  );
}

const MoodFace: React.FC<MoodFaceProps> = ({ mood, moodValue }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-full h-full">
        <Canvas camera={{ position: [0, 0, 3], fov: 45 }}>
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <spotLight
            position={[0, 5, 5]}
            angle={0.3}
            penumbra={1}
            intensity={0.5}
            color="#e8c282"
          />
          <Face moodValue={moodValue} />
        </Canvas>
      </div>

      {/* Mood Text Overlay - Lowered position */}
      <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center text-center">
        <h3 className="text-2xl font-serif text-[#e8c282] mb-2">
          {mood}
        </h3>
        <p className="text-sm text-[#e8c282]/70">
          Adjust the slider to change mood
        </p>
      </div>
    </div>
  );
};

export default MoodFace;
