
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MoodFaceProps {
  mood: string;
  moodValue: number;
}

function Face({ mood, moodValue }: MoodFaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const mouthRef = useRef<THREE.Mesh>(null);
  
  // Interpolate between moods based on slider value
  const getMoodConfig = (value: number) => {
    // BAD: 0, OKAY: 1, GOOD: 2
    const colors = {
      bad: new THREE.Color('#ff5252'),    // Red for bad
      okay: new THREE.Color('#e8c282'),   // Gold for okay
      good: new THREE.Color('#4caf50')    // Green for good
    };
    
    let color, mouthCurve, eyeShape, eyeScale;
    
    if (value <= 1) {
      // Interpolate between BAD and OKAY
      const t = value;
      color = colors.bad.clone().lerp(colors.okay, t);
      mouthCurve = THREE.MathUtils.lerp(-0.8, 0, t);  // Deeper frown for bad
      eyeShape = THREE.MathUtils.lerp(0, 0.5, t);     // Round eyes for bad, slightly oval for okay
      eyeScale = THREE.MathUtils.lerp(1.2, 1, t);     // Larger eyes for bad
    } else {
      // Interpolate between OKAY and GOOD
      const t = value - 1;
      color = colors.okay.clone().lerp(colors.good, t);
      mouthCurve = THREE.MathUtils.lerp(0, 0.8, t);   // Bigger smile for good
      eyeShape = THREE.MathUtils.lerp(0.5, 1, t);     // More oval/happy eyes for good
      eyeScale = THREE.MathUtils.lerp(1, 0.9, t);     // Slightly squinted eyes for good
    }
    
    return { color, mouthCurve, eyeShape, eyeScale };
  };
  
  useFrame((state) => {
    if (!meshRef.current || !mouthRef.current || !leftEyeRef.current || !rightEyeRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Subtle breathing animation
    meshRef.current.position.y = Math.sin(time * 0.6) * 0.03;
    meshRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
    
    // Get interpolated values for current mood
    const config = getMoodConfig(moodValue);
    
    // Update material colors
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.color.copy(config.color);
      meshRef.current.material.emissive.copy(config.color).multiplyScalar(0.3);
    }
    
    // Update facial expressions
    
    // Eyes - shape changes based on mood
    if (leftEyeRef.current.geometry instanceof THREE.SphereGeometry) {
      leftEyeRef.current.scale.setY(config.eyeScale + Math.sin(time * 3) * 0.05);
      rightEyeRef.current.scale.setY(config.eyeScale + Math.sin(time * 3) * 0.05);
      
      // Occasionally blink
      if (Math.sin(time * 0.5) > 0.95) {
        leftEyeRef.current.scale.setY(0.1);
        rightEyeRef.current.scale.setY(0.1);
      }
    }
    
    // Mouth - curve changes based on mood
    if (mouthRef.current) {
      // Update mouth curve
      mouthRef.current.rotation.z = config.mouthCurve < 0 ? Math.PI : 0; // Flip for frown
      mouthRef.current.scale.y = Math.abs(config.mouthCurve) * 1.5 + 0.5;
      mouthRef.current.position.y = config.mouthCurve * 0.1 - 0.5;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]}>
      {/* Main face */}
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial 
        roughness={0.1} 
        metalness={0.6} 
        envMapIntensity={0.8}
        transparent={true}
        opacity={0.95}
      />
      
      {/* Eyes */}
      <group position={[0, 0.25, 1.3]}>
        {/* Left eye */}
        <mesh ref={leftEyeRef} position={[-0.45, 0, 0]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshBasicMaterial color="#2a180f" />
        </mesh>
        
        {/* Right eye */}
        <mesh ref={rightEyeRef} position={[0.45, 0, 0]}>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshBasicMaterial color="#2a180f" />
        </mesh>
        
        {/* Mouth */}
        <mesh ref={mouthRef} position={[0, -0.5, 0]}>
          <torusGeometry args={[0.4, 0.1, 32, 32, Math.PI]} />
          <meshBasicMaterial color="#2a180f" side={THREE.DoubleSide} />
        </mesh>
      </group>
    </mesh>
  );
}

const MoodFace: React.FC<MoodFaceProps> = ({ mood, moodValue }) => {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-[#140D07] animate-glow-3d">
      <Canvas camera={{ position: [0, 0, 4], fov: 40 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[-5, 5, 5]} intensity={1.2} color="#ffffff" />
        <pointLight position={[5, 5, 5]} intensity={0.6} color="#e8c282" />
        <Face mood={mood} moodValue={moodValue} />
      </Canvas>
    </div>
  );
};

export default MoodFace;
