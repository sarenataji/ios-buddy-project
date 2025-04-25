
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
          mouthCurve: 0.5, // Upward curve
          eyeScale: 1
        };
      case 1: // OKAY
        return {
          mouthCurve: 0, // Straight line
          eyeScale: 1
        };
      case 2: // BAD
        return {
          mouthCurve: -0.5, // Downward curve
          eyeScale: 0.8
        };
      default:
        return {
          mouthCurve: 0,
          eyeScale: 1
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
      <mesh position={[-0.3, 0.2, 0.85]} scale={[0.12 * config.eyeScale, 0.12 * config.eyeScale, 0.12]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#2a180f" />
      </mesh>

      {/* Right Eye */}
      <mesh position={[0.3, 0.2, 0.85]} scale={[0.12 * config.eyeScale, 0.12 * config.eyeScale, 0.12]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#2a180f" />
      </mesh>

      {/* Mouth */}
      <mesh position={[0, -0.1, 0.85]}>
        <torusGeometry args={[0.3, 0.05, 16, 16, Math.PI]} />
        <meshBasicMaterial color="#2a180f" />
        <group rotation={[0, 0, config.mouthCurve]}>
          <mesh>
            <torusGeometry args={[0.3, 0.05, 16, 16, Math.PI]} />
            <meshBasicMaterial color="#2a180f" />
          </mesh>
        </group>
      </mesh>
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

      {/* Mood Text Overlay */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-4 text-center">
        <h3 className="text-2xl font-serif text-[#e8c282] mb-1">
          {mood}
        </h3>
        <p className="text-sm text-[#e8c282]/70">
          Swipe left or right to explore moods
        </p>
      </div>
    </div>
  );
};

export default MoodFace;
