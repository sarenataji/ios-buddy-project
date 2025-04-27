
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

  const getMoodConfig = () => {
    switch (moodValue) {
      case 0: // GOOD
        return {
          mouthCurveTop: Math.PI * 0.3,      // Strong upward curve for smile
          mouthCurveBottom: Math.PI * 0.3,    // Strong upward curve for smile
          mouthScale: 0.55,                   // Wide smile
          eyeScale: 1.3,                      // Wider eyes for happy look
          eyePosition: 0.15,                  // Higher eyes for happier expression
          mouthThickness: 0.12,               // Thicker mouth for visibility
          mouthYPosition: -0.15,              // Position mouth properly
        };
      case 1: // OKAY
        return {
          mouthCurveTop: 0,                   // Flat line for neutral expression
          mouthCurveBottom: 0,                // Flat line for neutral expression 
          mouthScale: 0.5,                    // Medium width for neutral mouth
          eyeScale: 1.1,                      // Normal eyes
          eyePosition: 0,                     // Standard eye position
          mouthThickness: 0.12,               // Consistent mouth thickness
          mouthYPosition: -0.15,              // Position mouth properly
        };
      case 2: // BAD
        return {
          mouthCurveTop: -Math.PI * 0.3,      // Strong downward curve for frown
          mouthCurveBottom: -Math.PI * 0.3,    // Strong downward curve for frown
          mouthScale: 0.55,                    // Wide frown
          eyeScale: 0.9,                       // Slightly smaller eyes for sad look
          eyePosition: -0.1,                   // Lower eyes for sad expression
          mouthThickness: 0.12,                // Consistent mouth thickness
          mouthYPosition: -0.2,                // Lower position for sad mouth
        };
      default:
        return {
          mouthCurveTop: 0,
          mouthCurveBottom: 0,
          mouthScale: 0.5,
          eyeScale: 1.1,
          eyePosition: 0,
          mouthThickness: 0.12,
          mouthYPosition: -0.15,
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

      {/* Eyes with improved positioning and visibility */}
      <mesh position={[-0.3, 0.3 + config.eyePosition, 0.85]} scale={[0.18 * config.eyeScale, 0.18 * config.eyeScale, 0.14]}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshBasicMaterial color="#2a180f" />
      </mesh>

      <mesh position={[0.3, 0.3 + config.eyePosition, 0.85]} scale={[0.18 * config.eyeScale, 0.18 * config.eyeScale, 0.14]}>
        <sphereGeometry args={[1, 20, 20]} />
        <meshBasicMaterial color="#2a180f" />
      </mesh>

      {/* Mouth with improved visibility and better curves */}
      <group position={[0, config.mouthYPosition, 0.85]}>
        {/* Top curve of mouth */}
        <mesh rotation={[0, 0, config.mouthCurveTop]} position={[0, 0.04, 0]}>
          <torusGeometry args={[config.mouthScale, config.mouthThickness, 20, 20, Math.PI]} />
          <meshBasicMaterial color="#2a180f" />
        </mesh>
        
        {/* Bottom curve of mouth */}
        <mesh rotation={[0, 0, config.mouthCurveBottom]} position={[0, -0.04, 0]}>
          <torusGeometry args={[config.mouthScale, config.mouthThickness, 20, 20, Math.PI]} />
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
        <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1.0} />
          <spotLight
            position={[0, 5, 5]}
            angle={0.3}
            penumbra={1}
            intensity={0.6}
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
