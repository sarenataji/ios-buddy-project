
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MoodFaceProps {
  mood: string;
  moodValue: number;
}

// Simple 3D Face Component
function Face({ mood, moodValue }: MoodFaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  // Map mood value to configuration
  const getMoodConfig = () => {
    const baseColor = new THREE.Color('#e8c282');
    
    switch (moodValue) {
      case 0: // GOOD
        return {
          color: baseColor.clone().multiplyScalar(1.2),
          mouthCurve: 0.8,
          eyeScale: 0.8,
          eyeRotation: 0.2,
          elevation: 0.2
        };
      case 1: // OKAY
        return {
          color: baseColor.clone(),
          mouthCurve: 0,
          eyeScale: 1,
          eyeRotation: 0,
          elevation: 0
        };
      case 2: // BAD
        return {
          color: baseColor.clone().multiplyScalar(0.7),
          mouthCurve: -0.8,
          eyeScale: 1.2,
          eyeRotation: -0.3,
          elevation: -0.2
        };
      default:
        return {
          color: baseColor.clone(),
          mouthCurve: 0,
          eyeScale: 1,
          eyeRotation: 0,
          elevation: 0
        };
    }
  };

  useFrame((state) => {
    if (!meshRef.current || !mouthRef.current || !eyesRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const config = getMoodConfig();
    
    // Basic animation
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.1 + config.elevation;
    meshRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
    
    // Update face color
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.color.copy(config.color);
    }
    
    // Eyes animation - blink occasionally
    if (eyesRef.current) {
      const blinkSpeed = time * 1;
      const isBlinking = Math.sin(blinkSpeed) > 0.97;
      eyesRef.current.scale.y = isBlinking ? 0.1 : config.eyeScale;
    }
    
    // Mouth animation based on mood
    if (mouthRef.current) {
      mouthRef.current.rotation.z = config.mouthCurve < 0 ? Math.PI : 0;
      mouthRef.current.scale.y = Math.abs(config.mouthCurve) + 0.5;
      mouthRef.current.position.y = config.mouthCurve * 0.1 - 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]} scale={1.8}>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#e8c282"
          roughness={0.5}
          metalness={0.3}
        />
        
        {/* Eyes */}
        <group ref={eyesRef} position={[0, 0.25, 1.3]}>
          <mesh position={[-0.45, 0, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshBasicMaterial color="#2a180f" />
          </mesh>
          
          <mesh position={[0.45, 0, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshBasicMaterial color="#2a180f" />
          </mesh>
        </group>
        
        {/* Mouth */}
        <mesh ref={mouthRef} position={[0, -0.5, 1.3]}>
          <torusGeometry args={[0.4, 0.15, 16, 16, Math.PI]} />
          <meshBasicMaterial color="#2a180f" side={THREE.DoubleSide} />
        </mesh>
      </mesh>
    </group>
  );
}

// 2D Fallback Face when WebGL isn't available
const FallbackFace: React.FC<MoodFaceProps> = ({ mood }) => {
  // Map the mood to an emoji
  const getMoodEmoji = () => {
    switch (mood) {
      case 'GOOD': return '😀';
      case 'OKAY': return '😐';
      case 'BAD': return '😔';
      default: return '😐';
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#140D07] to-[#1a0c05] rounded-full overflow-hidden border-4 border-[#e8c282]">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <span className="text-8xl mb-4">{getMoodEmoji()}</span>
        <p className="text-lg text-[#e8c282] font-bold">{mood}</p>
      </div>
    </div>
  );
};

const MoodFace: React.FC<MoodFaceProps> = ({ mood, moodValue }) => {
  // Simple version that always attempts 3D first with fallback to 2D if needed
  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-[#140D07]">
      <Canvas 
        camera={{ position: [0, 0, 4], fov: 40 }}
        gl={{ 
          antialias: false,
          alpha: true,
          powerPreference: "default"
        }}
        fallback={<FallbackFace mood={mood} moodValue={moodValue} />}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[0, 0, 5]} intensity={1.0} color="#ffffff" />
        <Face mood={mood} moodValue={moodValue} />
      </Canvas>
    </div>
  );
};

export default MoodFace;
