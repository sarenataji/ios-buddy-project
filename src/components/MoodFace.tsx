
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
    
    let color, mouthCurve, eyeScale, eyeRotation, elevation;
    
    if (value <= 1) {
      // Interpolate between BAD and OKAY
      const t = value;
      color = colors.bad.clone().lerp(colors.okay, t);
      mouthCurve = THREE.MathUtils.lerp(-0.8, 0, t);
      eyeScale = THREE.MathUtils.lerp(1.2, 1, t);
      eyeRotation = THREE.MathUtils.lerp(-0.3, 0, t);
      elevation = THREE.MathUtils.lerp(0.5, 0.8, t);
    } else {
      // Interpolate between OKAY and GOOD
      const t = value - 1;
      color = colors.okay.clone().lerp(colors.good, t);
      mouthCurve = THREE.MathUtils.lerp(0, 0.8, t);
      eyeScale = THREE.MathUtils.lerp(1, 0.8, t);
      eyeRotation = THREE.MathUtils.lerp(0, 0.2, t);
      elevation = THREE.MathUtils.lerp(0.8, 1.2, t);
    }
    
    return { color, mouthCurve, eyeScale, eyeRotation, elevation };
  };
  
  useFrame((state) => {
    if (!meshRef.current || !mouthRef.current || !eyesRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const config = getMoodConfig(moodValue);
    
    // Enhanced floating animation
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.1 + config.elevation;
    
    // Smooth rotation
    meshRef.current.rotation.y = Math.sin(time * 0.3) * 0.15;
    meshRef.current.rotation.z = Math.sin(time * 0.2) * 0.05;
    
    // Update face material
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.color.copy(config.color);
      meshRef.current.material.emissive.copy(config.color).multiplyScalar(0.3);
      meshRef.current.material.metalness = 0.7;
      meshRef.current.material.roughness = 0.2;
    }
    
    // Enhanced eye animations
    if (eyesRef.current) {
      eyesRef.current.scale.y = config.eyeScale + Math.sin(time * 3) * 0.05;
      eyesRef.current.rotation.z = config.eyeRotation;
      
      // More natural blink
      if (Math.sin(time * 0.5) > 0.98) {
        eyesRef.current.scale.y = 0.1;
      }
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
      {/* Enhanced face mesh with better materials */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.5, 128, 128]} />
        <meshStandardMaterial
          roughness={0.2}
          metalness={0.7}
          envMapIntensity={1}
          transparent={true}
          opacity={0.95}
        />
        
        {/* Enhanced eyes with better depth */}
        <group ref={eyesRef} position={[0, 0.25, 1.3]}>
          <mesh position={[-0.45, 0, 0]}>
            <sphereGeometry args={[0.22, 32, 32]} />
            <meshStandardMaterial
              color="#2a180f"
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>
          
          <mesh position={[0.45, 0, 0]}>
            <sphereGeometry args={[0.22, 32, 32]} />
            <meshStandardMaterial
              color="#2a180f"
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>
        </group>
        
        {/* Enhanced mouth with better materials */}
        <mesh ref={mouthRef} position={[0, -0.15, 1.3]}>
          <torusGeometry args={[0.4, 0.12, 32, 32, Math.PI]} />
          <meshStandardMaterial
            color="#2a180f"
            roughness={0.3}
            metalness={0.5}
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
