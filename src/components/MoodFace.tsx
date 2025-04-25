
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MoodFaceProps {
  mood: string;
  moodValue: number;
}

function Face({ mood, moodValue }: MoodFaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  const getMoodConfig = (value: number) => {
    const colors = {
      bad: new THREE.Color('#e8c282').multiplyScalar(0.6),
      okay: new THREE.Color('#e8c282'),
      good: new THREE.Color('#e8c282').multiplyScalar(1.2)
    };
    
    let color, mouthCurve, eyeScale, eyeRotation, elevation, zPosition;
    
    if (value <= 1) {
      const t = value;
      color = colors.good.clone().lerp(colors.okay, t);
      mouthCurve = THREE.MathUtils.lerp(0.8, 0, t);
      eyeScale = THREE.MathUtils.lerp(0.8, 1, t);
      eyeRotation = THREE.MathUtils.lerp(0.2, 0, t);
      elevation = THREE.MathUtils.lerp(1.2, 0.8, t);
      zPosition = THREE.MathUtils.lerp(2, 1.5, t);
    } else {
      const t = value - 1;
      color = colors.okay.clone().lerp(colors.bad, t);
      mouthCurve = THREE.MathUtils.lerp(0, -0.8, t);
      eyeScale = THREE.MathUtils.lerp(1, 1.2, t);
      eyeRotation = THREE.MathUtils.lerp(0, -0.3, t);
      elevation = THREE.MathUtils.lerp(0.8, 0.5, t);
      zPosition = THREE.MathUtils.lerp(1.5, 1, t);
    }
    
    return { color, mouthCurve, eyeScale, eyeRotation, elevation, zPosition };
  };

  useFrame((state) => {
    if (!meshRef.current || !mouthRef.current || !eyesRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const config = getMoodConfig(moodValue);
    
    // Enhanced floating animation with more pronounced "out of box" effect
    meshRef.current.position.z = Math.sin(time * 0.5) * 0.3 + config.zPosition;
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.2 + config.elevation;
    
    // Enhanced rotation for more lifelike movement
    meshRef.current.rotation.y = Math.sin(time * 0.3) * 0.3;
    meshRef.current.rotation.z = Math.sin(time * 0.2) * 0.1;
    
    // Update face material
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.color.copy(config.color);
      meshRef.current.material.emissive.copy(config.color).multiplyScalar(0.4);
      meshRef.current.material.metalness = 0.8;
      meshRef.current.material.roughness = 0.2;
    }
    
    // Enhanced eye animations
    if (eyesRef.current) {
      const blinkSpeed = time * 2;
      const normalizedBlink = Math.sin(blinkSpeed);
      const isBlinking = normalizedBlink > 0.97;
      
      eyesRef.current.scale.y = isBlinking ? 0.1 : config.eyeScale + Math.sin(time * 3) * 0.05;
      eyesRef.current.rotation.z = config.eyeRotation;
    }
    
    // Enhanced mouth animation
    if (mouthRef.current) {
      mouthRef.current.rotation.z = config.mouthCurve < 0 ? Math.PI : 0;
      mouthRef.current.scale.y = Math.abs(config.mouthCurve) * 1.5 + 0.5;
      mouthRef.current.position.y = config.mouthCurve * 0.1 - 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]} scale={1.6}>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial
          roughness={0.2}
          metalness={0.8}
          envMapIntensity={1.5}
          transparent={true}
          opacity={0.95}
        />
        
        {/* Eyes */}
        <group ref={eyesRef} position={[0, 0.25, 1.3]}>
          <mesh position={[-0.45, 0, 0]}>
            <sphereGeometry args={[0.25, 24, 24]} />
            <meshStandardMaterial
              color="#2a180f"
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>
          
          <mesh position={[0.45, 0, 0]}>
            <sphereGeometry args={[0.25, 24, 24]} />
            <meshStandardMaterial
              color="#2a180f"
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>
        </group>
        
        {/* Mouth */}
        <mesh ref={mouthRef} position={[0, -0.15, 1.3]}>
          <torusGeometry args={[0.4, 0.15, 24, 24, Math.PI]} />
          <meshStandardMaterial
            color="#2a180f"
            roughness={0.3}
            metalness={0.8}
            side={THREE.DoubleSide}
          />
        </mesh>
      </mesh>
    </group>
  );
}

const MoodFace: React.FC<MoodFaceProps> = ({ mood, moodValue }) => {
  const [errorState, setErrorState] = useState<boolean>(false);
  
  // Reset error state when props change
  useEffect(() => {
    setErrorState(false);
  }, [mood, moodValue]);

  // Fallback UI in case of WebGL errors
  if (errorState) {
    return (
      <div className="w-full h-full rounded-lg flex items-center justify-center bg-[#140D07]">
        <div className="text-center p-4">
          <p className="text-[#e8c282] mb-2">Unable to display 3D face</p>
          <p className="text-[#e8c282]/60 text-sm">Your mood: {mood}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-visible bg-[#140D07]">
      <Canvas 
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          preserveDrawingBuffer: true
        }}
        onError={() => setErrorState(true)}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[-5, 5, 5]} intensity={1.4} color="#e8c282" />
        <pointLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <Face mood={mood} moodValue={moodValue} />
      </Canvas>
    </div>
  );
};

export default MoodFace;
