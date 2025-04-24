
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MoodFaceProps {
  mood: string | null;
}

function Face({ mood }: { mood: string | null }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Add subtle animation to the face
    meshRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
  });

  // Different expressions for different moods
  const getMoodConfig = () => {
    switch(mood) {
      case "GOOD":
        return {
          eyeRotation: Math.PI * 0.1,
          mouthRotation: Math.PI * 0.1,
          color: '#e8c282'
        };
      case "OKAY":
        return {
          eyeRotation: 0,
          mouthRotation: 0,
          color: '#7e5a39'
        };
      case "BAD":
        return {
          eyeRotation: -Math.PI * 0.1,
          mouthRotation: -Math.PI * 0.1,
          color: '#2a180f'
        };
      default:
        return {
          eyeRotation: 0,
          mouthRotation: 0,
          color: '#7e5a39'
        };
    }
  };

  const config = getMoodConfig();

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 32, 32]} />
      <meshStandardMaterial 
        color={config.color}
        roughness={0.3}
        metalness={0.7}
        emissive={config.color}
        emissiveIntensity={0.2}
      />
      {/* Facial features */}
      <group position={[0, 0.25, 1.4]}>
        {/* Eyes */}
        <mesh position={[-0.3, 0, 0]} rotation={[config.eyeRotation, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#2a180f" />
        </mesh>
        <mesh position={[0.3, 0, 0]} rotation={[config.eyeRotation, 0, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshBasicMaterial color="#2a180f" />
        </mesh>
        {/* Mouth */}
        <mesh position={[0, -0.3, 0]} rotation={[0, 0, config.mouthRotation]}>
          <torusGeometry args={[0.2, 0.05, 16, 16, Math.PI]} />
          <meshBasicMaterial color="#2a180f" />
        </mesh>
      </group>
    </mesh>
  );
}

const MoodFace: React.FC<MoodFaceProps> = ({ mood }) => {
  return (
    <div className="w-full h-[350px] rounded-lg overflow-hidden bg-[#140D07]">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <Face mood={mood} />
      </Canvas>
    </div>
  );
};

export default MoodFace;
