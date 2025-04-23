
import React, { useRef, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Award, Star, PartyPopper } from "lucide-react";
import * as THREE from "three";

const CongratsAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Show congratulatory message
    toast({
      title: "Congratulations! 🎉",
      description: "You've completed all events for today. Time to relax!",
      duration: 5000,
    });

    // Setup Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true,
    });
    renderer.setSize(300, 300);
    containerRef.current.appendChild(renderer.domElement);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xe8c282, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // Create golden trophy shape
    const trophyGroup = new THREE.Group();
    scene.add(trophyGroup);
    
    // Trophy cup
    const cupGeometry = new THREE.CylinderGeometry(1, 1.5, 2, 32);
    const cupMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xe8c282,
      metalness: 0.8,
      roughness: 0.2,
    });
    const cup = new THREE.Mesh(cupGeometry, cupMaterial);
    cup.position.y = 1;
    trophyGroup.add(cup);
    
    // Trophy base
    const baseGeometry = new THREE.CylinderGeometry(0.6, 0.8, 0.5, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xe8c282,
      metalness: 0.9,
      roughness: 0.1,
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.5;
    trophyGroup.add(base);
    
    // Trophy stand
    const standGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 32);
    const standMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xe8c282,
      metalness: 0.9,
      roughness: 0.1,
    });
    const stand = new THREE.Mesh(standGeometry, standMaterial);
    stand.position.y = 0;
    trophyGroup.add(stand);
    
    // Create stars around the trophy
    const starCount = 20;
    const starGeometry = new THREE.OctahedronGeometry(0.2, 0);
    const starMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xe8c282,
      metalness: 0.5,
      roughness: 0.3,
      emissive: 0xe8c282,
      emissiveIntensity: 0.5,
    });
    
    const stars = [];
    for (let i = 0; i < starCount; i++) {
      const star = new THREE.Mesh(starGeometry, starMaterial);
      
      // Random position on a sphere around the trophy
      const phi = Math.acos(-1 + Math.random() * 2);
      const theta = Math.random() * Math.PI * 2;
      const radius = 3 + Math.random() * 2;
      
      star.position.x = radius * Math.sin(phi) * Math.cos(theta);
      star.position.y = radius * Math.sin(phi) * Math.sin(theta);
      star.position.z = radius * Math.cos(phi);
      
      star.rotation.x = Math.random() * Math.PI;
      star.rotation.y = Math.random() * Math.PI;
      star.rotation.z = Math.random() * Math.PI;
      
      scene.add(star);
      stars.push({
        mesh: star,
        speed: 0.01 + Math.random() * 0.02,
        rotationAxis: new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        ).normalize()
      });
    }
    
    // Position camera
    camera.position.z = 7;
    
    // Animation loop
    let frameId: number;
    
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      
      // Rotate trophy
      trophyGroup.rotation.y += 0.01;
      
      // Animate stars
      stars.forEach(star => {
        star.mesh.rotation.x += 0.01;
        star.mesh.rotation.y += 0.01;
        star.mesh.position.applyAxisAngle(star.rotationAxis, star.speed);
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(frameId);
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          } else if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          }
        }
      });
    };
  }, [toast]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a1f2c] border border-[#e8c28233] rounded-lg p-6 max-w-sm w-full text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex gap-2">
            <Star className="h-6 w-6 text-[#e8c282]" />
            <Award className="h-6 w-6 text-[#e8c282]" />
            <PartyPopper className="h-6 w-6 text-[#e8c282]" />
          </div>
        </div>
        
        <h3 className="text-2xl font-serif mb-2 text-[#edd6ae]">
          Congratulations!
        </h3>
        
        <p className="text-[#e8c282aa] mb-4">
          You've completed all your scheduled events for today. Time to relax and enjoy the rest of your day!
        </p>
        
        <div 
          ref={containerRef} 
          className="w-[300px] h-[300px] mx-auto mb-4"
        />
      </div>
    </div>
  );
};

export default CongratsAnimation;
