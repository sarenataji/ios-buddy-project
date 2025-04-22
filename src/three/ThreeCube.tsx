
import React, { useRef } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { BoxGeometry, MeshStandardMaterial } from "three";

// Extend JSX elements with Three.js objects
extend({ BoxGeometry, MeshStandardMaterial });

function RotatingCube() {
  const mesh = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.008;
    }
  });

  return (
    <mesh ref={mesh}>
      <boxGeometry args={[1.8, 1.8, 1.8]} />
      <meshStandardMaterial color="#7e5a39" roughness={0.32} metalness={0.2} />
    </mesh>
  );
}

// 3D scene container: subtle, minimal light - will look good on deep brown
const ThreeCube = () => (
  <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
    <ambientLight intensity={0.65} />
    <directionalLight position={[2.5, 5, 5]} intensity={1.2} />
    <RotatingCube />
  </Canvas>
);

export default ThreeCube;
