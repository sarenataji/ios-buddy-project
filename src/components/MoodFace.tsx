
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
      // Subtle breathing animation
      const breathe = Math.sin(state.clock.elapsedTime * 0.5) * 0.01;
      meshRef.current.scale.setScalar(0.8 + breathe); // Reduced base scale to 0.8
      
      // Very subtle rotation for liveliness
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
    }
  });

  const getMoodConfig = () => {
    switch (moodValue) {
      case 0: // GOOD
        return {
          mouthCurveTop: Math.PI * 0.1,       // Reduced curve for more natural smile
          mouthCurveBottom: Math.PI * 0.1,     // Matching bottom curve
          mouthScale: 0.3,                     // Smaller mouth width
          eyeScale: 0.8,                       // Smaller eyes
          eyePosition: 0.08,                   // Slightly raised eyes
          mouthThickness: 0.05,                // Thinner mouth
          mouthYPosition: -0.15,               // Adjusted mouth position
          eyeSpacing: 0.2,                     // Closer eyes
        };
      case 1: // OKAY
        return {
          mouthCurveTop: 0,                    // Straight line
          mouthCurveBottom: 0,                 // Straight line
          mouthScale: 0.25,                    // Smaller neutral mouth
          eyeScale: 0.7,                       // Normal sized eyes
          eyePosition: 0,                      // Centered position
          mouthThickness: 0.05,                // Consistent thickness
          mouthYPosition: -0.15,               // Centered position
          eyeSpacing: 0.2,                     // Standard spacing
        };
      case 2: // BAD
        return {
          mouthCurveTop: -Math.PI * 0.1,      // Gentle frown
          mouthCurveBottom: -Math.PI * 0.1,    // Matching curve
          mouthScale: 0.3,                     // Consistent width
          eyeScale: 0.7,                       // Slightly smaller eyes
          eyePosition: -0.05,                  // Lowered eyes
          mouthThickness: 0.05,                // Consistent thickness
          mouthYPosition: -0.18,               // Lower position for sad expression
          eyeSpacing: 0.2,                     // Standard spacing
        };
      default:
        return {
          mouthCurveTop: 0,
          mouthCurveBottom: 0,
          mouthScale: 0.25,
          eyeScale: 0.7,
          eyePosition: 0,
          mouthThickness: 0.05,
          mouthYPosition: -0.15,
          eyeSpacing: 0.2,
        };
    }
  };

  const config = getMoodConfig();

  return (
    <group ref={meshRef}>
      {/* Face base */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial 
          color="#e8c282"
          metalness={0.1}
          roughness={0.4}
        />
      </mesh>

      {/* Eyes */}
      <mesh 
        position={[-config.eyeSpacing, 0.15 + config.eyePosition, 0.65]} 
        scale={[0.1 * config.eyeScale, 0.1 * config.eyeScale, 0.05]}
      >
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#2a180f" />
      </mesh>

      <mesh 
        position={[config.eyeSpacing, 0.15 + config.eyePosition, 0.65]} 
        scale={[0.1 * config.eyeScale, 0.1 * config.eyeScale, 0.05]}
      >
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#2a180f" />
      </mesh>

      {/* Mouth */}
      <group position={[0, config.mouthYPosition, 0.65]}>
        <mesh rotation={[0, 0, config.mouthCurveTop]}>
          <torusGeometry args={[config.mouthScale, config.mouthThickness, 16, 16, Math.PI]} />
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
        <Canvas camera={{ position: [0, 0, 2.5], fov: 35 }}>
          <ambientLight intensity={0.8} />
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

      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center text-center">
        <h3 className="text-3xl font-serif text-[#e8c282] mb-2 font-bold">
          {mood}
        </h3>
        <p className="text-sm text-[#e8c282]/80">
          Adjust the slider to change mood
        </p>
      </div>
    </div>
  );
};

export default MoodFace;
