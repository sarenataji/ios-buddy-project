
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MoodFaceProps {
  mood: string;
  moodValue: number;
}

// Simple 2D Fallback Face when WebGL isn't available
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

// 3D Face Component
function Face({ mood, moodValue }: MoodFaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Mesh>(null);

  // Simplified mood configuration
  const getMoodConfig = () => {
    const baseColor = new THREE.Color('#e8c282');
    
    // We're using a simplified version to reduce calculations
    if (moodValue === 0) {
      return {
        color: baseColor.clone().multiplyScalar(1.2),
        mouthCurve: 0.8,
        eyeScale: 0.8,
        eyeRotation: 0.2,
        elevation: 1.2
      };
    } else if (moodValue === 1) {
      return {
        color: baseColor.clone(),
        mouthCurve: 0,
        eyeScale: 1,
        eyeRotation: 0,
        elevation: 0.8
      };
    } else {
      return {
        color: baseColor.clone().multiplyScalar(0.6),
        mouthCurve: -0.8,
        eyeScale: 1.2,
        eyeRotation: -0.3,
        elevation: 0.5
      };
    }
  };

  useFrame((state) => {
    if (!meshRef.current || !mouthRef.current || !eyesRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const config = getMoodConfig();
    
    // Very basic animation
    meshRef.current.position.z = Math.sin(time * 0.5) * 0.2 + 0.5;
    meshRef.current.position.y = Math.sin(time * 0.5) * 0.1 + config.elevation;
    
    // Simple rotation only
    meshRef.current.rotation.y = Math.sin(time * 0.3) * 0.2;
    
    // Update face material - simplified
    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.color.copy(config.color);
    }
    
    // Eyes animation - only blink occasionally
    if (eyesRef.current) {
      const blinkSpeed = time * 1;
      const isBlinking = Math.sin(blinkSpeed) > 0.97;
      eyesRef.current.scale.y = isBlinking ? 0.1 : config.eyeScale;
    }
    
    // Mouth animation - fixed position
    if (mouthRef.current) {
      mouthRef.current.rotation.z = config.mouthCurve < 0 ? Math.PI : 0;
      mouthRef.current.scale.y = Math.abs(config.mouthCurve) + 0.5;
      mouthRef.current.position.y = config.mouthCurve * 0.1 - 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]} scale={1.8}>
      <mesh ref={meshRef} castShadow>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshStandardMaterial
          color="#e8c282"
          roughness={0.5}
          metalness={0.3}
        />
        
        {/* Eyes - simplified */}
        <group ref={eyesRef} position={[0, 0.25, 1.3]}>
          <mesh position={[-0.45, 0, 0]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshBasicMaterial color="#2a180f" />
          </mesh>
          
          <mesh position={[0.45, 0, 0]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshBasicMaterial color="#2a180f" />
          </mesh>
        </group>
        
        {/* Mouth - simplified */}
        <mesh ref={mouthRef} position={[0, -0.15, 1.3]}>
          <torusGeometry args={[0.4, 0.15, 8, 8, Math.PI]} />
          <meshBasicMaterial color="#2a180f" side={THREE.DoubleSide} />
        </mesh>
      </mesh>
    </group>
  );
}

const MoodFace: React.FC<MoodFaceProps> = ({ mood, moodValue }) => {
  const [errorState, setErrorState] = useState<boolean>(false);
  
  // Force fallback if WebGL errors are detected
  useEffect(() => {
    // Check if WebGL is supported
    const canvas = document.createElement('canvas');
    
    // Correct way to check for WebGL support
    try {
      // Try to get WebGL context (not 2D context)
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      // If we couldn't get a WebGL context, use fallback
      if (!gl) {
        console.log("WebGL not supported - using fallback");
        setErrorState(true);
      } else {
        // Clean up WebGL context if we got one
        const loseContext = gl.getExtension('WEBGL_lose_context');
        if (loseContext) {
          loseContext.loseContext();
        }
      }
    } catch (error) {
      console.error("Error checking WebGL support:", error);
      setErrorState(true);
    }
  }, []);

  // If any error occurs, use the fallback immediately
  if (errorState) {
    console.log("Using fallback face due to error state");
    return <FallbackFace mood={mood} moodValue={moodValue} />;
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-[#140D07]">
      <Canvas 
        camera={{ position: [0, 0, 4], fov: 40 }}
        gl={{ 
          antialias: false, // Disable for performance
          alpha: true,
          powerPreference: "default",
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: true // Fail immediately if WebGL has issues
        }}
        onError={() => {
          console.error("Canvas error - switching to fallback");
          setErrorState(true);
        }}
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
