import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OceanEnvironmentProps {
  isSubmerged: boolean;
}

export const OceanEnvironment: React.FC<OceanEnvironmentProps> = ({ isSubmerged }) => {
  const waterMeshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  // Gentle water surface movement & particle drift
  useFrame((state, delta) => {
    if (waterMeshRef.current) {
      waterMeshRef.current.position.y = 0.05 + Math.sin(state.clock.getElapsedTime() * 1.2) * 0.01;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.02;
    }
  });

  // Particle positions for polar underwater suspended matter
  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 10;
    positions[i + 1] = (Math.random() - 0.5) * 6 - 1;
    positions[i + 2] = (Math.random() - 0.5) * 10;
  }

  return (
    <group>
      {/* Water Surface Plane */}
      <mesh ref={waterMeshRef} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30, 32, 32]} />
        <meshPhysicalMaterial
          color="#0284c7"
          transmission={0.8}
          opacity={0.65}
          transparent={true}
          roughness={0.1}
          metalness={0.1}
          ior={1.333}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Underwater Suspended Particulate Matter (Polar Ocean) */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.03} color="#e0f2fe" transparent opacity={0.4} />
      </points>

      {/* Under-Ice Canopy Grid when Submerged */}
      {isSubmerged && (
        <group position={[0, 0.8, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#f1f5f9" opacity={0.85} transparent roughness={0.3} />
          </mesh>
          <gridHelper args={[20, 20, '#38bdf8', '#0284c7']} position={[0, -0.01, 0]} />
        </group>
      )}
    </group>
  );
};
