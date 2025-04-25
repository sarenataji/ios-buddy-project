
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
    
    // Simple animation to avoid performance issues
    meshRef.current.position.z = Math.sin(time * 0.5) * 0.2 + config.zPosition;
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.1 + config.elevation;
    
    // Simplified rotation
    meshRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
    meshRef.current.rotation.z = Math.sin(time * 0.2) * 0.05;
    
    // Update face material - simplified for performance
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.color.copy(config.color);
      meshRef.current.material.emissive.copy(config.color).multiplyScalar(0.2);
    }
    
    // Eyes animation - simplified
    if (eyesRef.current) {
      const blinkSpeed = time * 2;
      const normalizedBlink = Math.sin(blinkSpeed);
      const isBlinking = normalizedBlink > 0.97;
      
      eyesRef.current.scale.y = isBlinking ? 0.1 : config.eyeScale;
      eyesRef.current.rotation.z = config.eyeRotation;
    }
    
    // Mouth animation - simplified
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
          roughness={0.3}
          metalness={0.5}
          transparent={true}
          opacity={0.95}
        />
        
        {/* Eyes */}
        <group ref={eyesRef} position={[0, 0.25, 1.3]}>
          <mesh position={[-0.45, 0, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial
              color="#2a180f"
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>
          
          <mesh position={[0.45, 0, 0]}>
            <sphereGeometry args={[0.25, 16, 16]} />
            <meshStandardMaterial
              color="#2a180f"
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>
        </group>
        
        {/* Mouth */}
        <mesh ref={mouthRef} position={[0, -0.15, 1.3]}>
          <torusGeometry args={[0.4, 0.15, 16, 16, Math.PI]} />
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

const FallbackFace: React.FC<MoodFaceProps> = ({ mood }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-[#140D07] to-[#1a0c05]">
      <div className="relative w-64 h-64 bg-[#7e5a39] rounded-full overflow-hidden border-4 border-[#e8c282]">
        {/* Static face representation */}
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 flex space-x-6">
          <div className="w-5 h-5 bg-[#2a180f] rounded-full"></div>
          <div className="w-5 h-5 bg-[#2a180f] rounded-full"></div>
        </div>
        <div className={`absolute bottom-1/4 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-[#2a180f] rounded-full ${mood === 'GOOD' ? 'scale-y-[-1]' : mood === 'BAD' ? '' : ''}`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-lg text-[#e8c282] font-bold">{mood}</p>
        </div>
      </div>
    </div>
  );
};

const MoodFace: React.FC<MoodFaceProps> = ({ mood, moodValue }) => {
  const [errorState, setErrorState] = useState<boolean>(false);
  const [hasRendered, setHasRendered] = useState<boolean>(false);
  
  // Reset error state when props change
  useEffect(() => {
    setErrorState(false);
  }, [mood, moodValue]);

  // Set hasRendered flag after initial render
  useEffect(() => {
    setHasRendered(true);
  }, []);

  // Fallback UI in case of WebGL errors or if not yet rendered
  if (errorState || !hasRendered) {
    return <FallbackFace mood={mood} moodValue={moodValue} />;
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-[#140D07]">
      <Canvas 
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "default", // Changed from high-performance which can cause issues
          preserveDrawingBuffer: true,
          failIfMajorPerformanceCaveat: false // Allow fallback renderer
        }}
        onError={() => setErrorState(true)}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[-5, 5, 5]} intensity={1.0} color="#e8c282" />
        <pointLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
        <Face mood={mood} moodValue={moodValue} />
      </Canvas>
    </div>
  );
};

export default MoodFace;
