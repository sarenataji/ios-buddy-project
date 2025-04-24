
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MoodFaceProps {
  mood: string;
  moodValue: number;
}

function Face({ mood, moodValue }: MoodFaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  
  // Interpolate between moods based on slider value
  const getMoodConfig = (value: number) => {
    // BAD: 0, OKAY: 1, GOOD: 2
    const colors = {
      bad: new THREE.Color('#2a180f'),
      okay: new THREE.Color('#7e5a39'),
      good: new THREE.Color('#e8c282')
    };
    
    let color, mouthCurve, eyeRotation;
    
    if (value <= 1) {
      // Interpolate between BAD and OKAY
      const t = value;
      color = colors.bad.clone().lerp(colors.okay, t);
      mouthCurve = THREE.MathUtils.lerp(-0.5, 0, t);
      eyeRotation = THREE.MathUtils.lerp(-0.3, 0, t);
    } else {
      // Interpolate between OKAY and GOOD
      const t = value - 1;
      color = colors.okay.clone().lerp(colors.good, t);
      mouthCurve = THREE.MathUtils.lerp(0, 0.5, t);
      eyeRotation = THREE.MathUtils.lerp(0, 0.3, t);
    }
    
    return { color, mouthCurve, eyeRotation };
  };
  
  useFrame((state) => {
    if (!meshRef.current || !mouthRef.current || !leftEyeRef.current || !rightEyeRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Subtle floating animation
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.05;
    meshRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
    
    // Get interpolated values
    const config = getMoodConfig(moodValue);
    
    // Update material colors
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.color.copy(config.color);
      meshRef.current.material.emissive.copy(config.color).multiplyScalar(0.2);
    }
    
    // Update expressions
    leftEyeRef.current.rotation.x = config.eyeRotation;
    rightEyeRef.current.rotation.x = config.eyeRotation;
    mouthRef.current.scale.y = 1 + Math.abs(config.mouthCurve);
    mouthRef.current.position.y = config.mouthCurve * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial
        roughness={0.3}
        metalness={0.7}
        envMapIntensity={0.5}
      />
      
      {/* Eyes */}
      <group position={[0, 0.25, 1.4]}>
        <mesh ref={leftEyeRef} position={[-0.3, 0, 0]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshBasicMaterial color="#2a180f" />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.3, 0, 0]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshBasicMaterial color="#2a180f" />
        </mesh>
        
        {/* Animated mouth */}
        <mesh ref={mouthRef} position={[0, -0.3, 0]}>
          <torusGeometry args={[0.3, 0.08, 32, 32, Math.PI]} />
          <meshBasicMaterial color="#2a180f" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </mesh>
  );
}

const MoodFace: React.FC<MoodFaceProps> = ({ mood, moodValue }) => {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-[#140D07]">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} />
        <Face mood={mood} moodValue={moodValue} />
      </Canvas>
    </div>
  );
};

export default MoodFace;
