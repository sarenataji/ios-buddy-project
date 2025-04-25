
import React, { useRef } from 'react';
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
    
    // Reversed order: 0 is GOOD, 1 is OKAY, 2 is BAD
    if (value <= 1) {
      // Interpolate between GOOD and OKAY
      const t = value;
      color = colors.good.clone().lerp(colors.okay, t);
      mouthCurve = THREE.MathUtils.lerp(0.8, 0, t);
      eyeScale = THREE.MathUtils.lerp(0.8, 1, t);
      eyeRotation = THREE.MathUtils.lerp(0.2, 0, t);
      elevation = THREE.MathUtils.lerp(1.2, 0.8, t);
      zPosition = THREE.MathUtils.lerp(1.5, 1, t);
    } else {
      // Interpolate between OKAY and BAD
      const t = value - 1;
      color = colors.okay.clone().lerp(colors.bad, t);
      mouthCurve = THREE.MathUtils.lerp(0, -0.8, t);
      eyeScale = THREE.MathUtils.lerp(1, 1.2, t);
      eyeRotation = THREE.MathUtils.lerp(0, -0.3, t);
      elevation = THREE.MathUtils.lerp(0.8, 0.5, t);
      zPosition = THREE.MathUtils.lerp(1, 0.5, t);
    }
    
    return { color, mouthCurve, eyeScale, eyeRotation, elevation, zPosition };
  };

  useFrame((state) => {
    if (!meshRef.current || !mouthRef.current || !eyesRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const config = getMoodConfig(moodValue);
    
    // Enhanced floating animation with more pronounced "out of box" effect
    meshRef.current.position.z = Math.sin(time * 0.5) * 0.15 + config.zPosition;
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.1 + config.elevation;
    
    // Enhanced rotation for more lifelike movement
    meshRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
    meshRef.current.rotation.z = Math.sin(time * 0.2) * 0.08;
    
    // Update face material with enhanced lighting
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
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[1.5, 128, 128]} />
        <meshStandardMaterial
          roughness={0.2}
          metalness={0.8}
          envMapIntensity={1.2}
          transparent={true}
          opacity={0.95}
        />
        
        <group ref={eyesRef} position={[0, 0.25, 1.3]}>
          <mesh position={[-0.45, 0, 0]}>
            <sphereGeometry args={[0.22, 32, 32]} />
            <meshStandardMaterial
              color="#2a180f"
              roughness={0.3}
              metalness={0.6}
            />
          </mesh>
          
          <mesh position={[0.45, 0, 0]}>
            <sphereGeometry args={[0.22, 32, 32]} />
            <meshStandardMaterial
              color="#2a180f"
              roughness={0.3}
              metalness={0.6}
            />
          </mesh>
        </group>
        
        <mesh ref={mouthRef} position={[0, -0.15, 1.3]}>
          <torusGeometry args={[0.4, 0.12, 32, 32, Math.PI]} />
          <meshStandardMaterial
            color="#2a180f"
            roughness={0.3}
            metalness={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      </mesh>
    </group>
  );
}

const MoodFace: React.FC<MoodFaceProps> = ({ mood, moodValue }) => {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-[#140D07]">
      <Canvas 
        camera={{ position: [0, 0, 4], fov: 40 }}
        gl={{ antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[-5, 5, 5]} intensity={1.2} color="#e8c282" />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <Face mood={mood} moodValue={moodValue} />
      </Canvas>
    </div>
  );
};

export default MoodFace;
