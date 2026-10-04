import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SagarPrahari3DModelProps {
  mode: string;
  propellerSpeed?: number;
  showLabels?: boolean;
  activeSensors: {
    sonarFov: boolean;
    upwardSonar: boolean;
    cameraFov: boolean;
    headingVector: boolean;
    velocityVector: boolean;
    gnssRange: boolean;
  };
}

export const SagarPrahari3DModel: React.FC<SagarPrahari3DModelProps> = ({
  mode,
  propellerSpeed = 1,
  showLabels = true,
  activeSensors
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const propPortRef = useRef<THREE.Group>(null);
  const propStbdRef = useRef<THREE.Group>(null);

  // Animation frame loop for thrusters & buoyancy bobbing
  useFrame((state, delta) => {
    // Spin propellers
    if (propPortRef.current) propPortRef.current.rotation.x += delta * 15 * propellerSpeed;
    if (propStbdRef.current) propStbdRef.current.rotation.x += delta * 15 * propellerSpeed;

    // Gentle buoyancy bobbing in surface mode
    if (groupRef.current) {
      if (mode.includes('SURFACE')) {
        groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.04;
        groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.02; // roll
        groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.01; // pitch
      } else if (mode.includes('DIVE') || mode.includes('SUBMERGED')) {
        groupRef.current.position.y = -1.2 + Math.sin(state.clock.getElapsedTime() * 0.8) * 0.02;
      }
    }
  });

  // Material definitions matching SAGAR-PRAHARI engineering specifications
  const hullYellowMat = new THREE.MeshStandardMaterial({
    color: '#f59e0b',
    roughness: 0.2,
    metalness: 0.1,
  });

  const hullNavyMat = new THREE.MeshStandardMaterial({
    color: '#0f172a',
    roughness: 0.3,
    metalness: 0.2,
  });

  const noseBumperMat = new THREE.MeshStandardMaterial({
    color: '#1e293b',
    roughness: 0.6,
    metalness: 0.1,
  });

  const solarPanelMat = new THREE.MeshStandardMaterial({
    color: '#0284c7',
    roughness: 0.1,
    metalness: 0.8,
  });

  const metalKeelMat = new THREE.MeshStandardMaterial({
    color: '#94a3b8',
    roughness: 0.3,
    metalness: 0.9,
  });

  const leadBulbMat = new THREE.MeshStandardMaterial({
    color: '#475569',
    roughness: 0.4,
    metalness: 0.8,
  });

  const thrusterBlueMat = new THREE.MeshStandardMaterial({
    color: '#0284c7',
    roughness: 0.3,
    metalness: 0.5,
  });

  const glassLensMat = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    transmission: 0.9,
    opacity: 1,
    transparent: true,
    roughness: 0,
    ior: 1.5,
  });

  return (
    <group ref={groupRef} scale={[2.2, 2.2, 2.2]}>
      
      {/* ===================================================
          1. MAIN MONOHULL ASSEMBLY (1.45m length, 0.34m beam)
      =================================================== */}
      
      {/* Middle Main Hull Body */}
      <mesh position={[0, 0, 0]} material={hullYellowMat}>
        <cylinderGeometry args={[0.22, 0.22, 1.1, 32]} />
      </mesh>

      {/* Top Deck Dark Strip */}
      <mesh position={[0, 0.115, 0]} material={hullNavyMat}>
        <boxGeometry args={[0.3, 0.02, 1.05]} />
      </mesh>

      {/* Ellipsoidal Bow (Front) */}
      <mesh position={[0, 0, 0.65]} rotation={[Math.PI / 2, 0, 0]} material={hullYellowMat}>
        <sphereGeometry args={[0.22, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Rubberized Impact Nose Bumper */}
      <mesh position={[0, 0, 0.76]} material={noseBumperMat}>
        <sphereGeometry args={[0.12, 16, 16]} />
      </mesh>

      {/* Paraboloid Tail (Rear) */}
      <mesh position={[0, 0, -0.65]} rotation={[-Math.PI / 2, 0, 0]} material={hullNavyMat}>
        <coneGeometry args={[0.22, 0.4, 32]} />
      </mesh>

      {/* ===================================================
          2. SOLAR DECK ARRAY (Deck mounted panels)
      =================================================== */}
      <group position={[0, 0.128, 0.05]}>
        <mesh material={solarPanelMat}>
          <boxGeometry args={[0.26, 0.008, 0.75]} />
        </mesh>
        {/* Grid lines on solar panel */}
        {[-0.2, 0, 0.2].map((z, i) => (
          <mesh key={i} position={[0, 0.005, z]} material={metalKeelMat}>
            <boxGeometry args={[0.25, 0.002, 0.005]} />
          </mesh>
        ))}
      </group>

      {/* ===================================================
          3. STAINLESS STEEL KEEL & 16.1 KG LEAD BULB
      =================================================== */}
      {/* Keel Strut */}
      <mesh position={[0, -0.28, 0]} material={metalKeelMat}>
        <boxGeometry args={[0.03, 0.35, 0.25]} />
      </mesh>

      {/* Streamlined Lead Bulb */}
      <mesh position={[0, -0.46, 0.05]} rotation={[Math.PI / 2, 0, 0]} material={leadBulbMat}>
        <cylinderGeometry args={[0.07, 0.06, 0.55, 32]} />
      </mesh>
      <mesh position={[0, -0.46, 0.32]} material={leadBulbMat}>
        <sphereGeometry args={[0.07, 16, 16]} />
      </mesh>

      {/* ===================================================
          4. MAST ASSEMBLY (0.83 m above hull axis)
      =================================================== */}
      <group position={[0, 0.12, 0.25]}>
        {/* Vertical Mast Pole */}
        <mesh position={[0, 0.35, 0]} material={metalKeelMat}>
          <cylinderGeometry args={[0.015, 0.018, 0.7, 16]} />
        </mesh>

        {/* Dual ZED-F9P GNSS Stub Antennas */}
        <mesh position={[-0.08, 0.7, 0]} material={noseBumperMat}>
          <cylinderGeometry args={[0.035, 0.035, 0.04, 16]} />
        </mesh>
        <mesh position={[0.08, 0.7, 0]} material={noseBumperMat}>
          <cylinderGeometry args={[0.035, 0.035, 0.04, 16]} />
        </mesh>

        {/* Iridium Satellite Stub */}
        <mesh position={[0, 0.73, -0.05]} material={metalKeelMat}>
          <cylinderGeometry args={[0.015, 0.015, 0.1, 16]} />
        </mesh>

        {/* Mast-Head Camera Pod */}
        <group position={[0, 0.52, 0.06]}>
          <mesh material={noseBumperMat}>
            <boxGeometry args={[0.08, 0.06, 0.07]} />
          </mesh>
          {/* Glass Lens */}
          <mesh position={[0, 0, 0.036]} rotation={[Math.PI / 2, 0, 0]} material={glassLensMat}>
            <cylinderGeometry args={[0.022, 0.022, 0.005, 16]} />
          </mesh>
        </group>

        {/* Ultrasonic Anemometer Top Shroud */}
        <mesh position={[0, 0.65, 0.05]} material={metalKeelMat}>
          <cylinderGeometry args={[0.04, 0.01, 0.05, 16]} />
        </mesh>

        {/* Forward LiDAR Pod */}
        <mesh position={[0, 0.4, 0.08]} material={hullNavyMat}>
          <cylinderGeometry args={[0.035, 0.035, 0.05, 16]} />
        </mesh>
      </group>

      {/* ===================================================
          5. PROPULSION SYSTEM (2x Aft T200 + 2x Vertical Dives)
      =================================================== */}
      
      {/* Port Aft T200 Thruster */}
      <group position={[-0.14, 0, -0.75]}>
        <mesh material={thrusterBlueMat}>
          <cylinderGeometry args={[0.045, 0.045, 0.12, 16]} rotation={[Math.PI / 2, 0, 0]} />
        </mesh>
        {/* Propeller */}
        <group ref={propPortRef} position={[0, 0, -0.07]}>
          <mesh material={noseBumperMat}>
            <boxGeometry args={[0.08, 0.015, 0.01]} />
          </mesh>
        </group>
      </group>

      {/* Starboard Aft T200 Thruster */}
      <group position={[0.14, 0, -0.75]}>
        <mesh material={thrusterBlueMat}>
          <cylinderGeometry args={[0.045, 0.045, 0.12, 16]} rotation={[Math.PI / 2, 0, 0]} />
        </mesh>
        {/* Propeller */}
        <group ref={propStbdRef} position={[0, 0, -0.07]}>
          <mesh material={noseBumperMat}>
            <boxGeometry args={[0.08, 0.015, 0.01]} />
          </mesh>
        </group>
      </group>

      {/* Vertical Dive Thruster Ducts in Hull */}
      <mesh position={[0, 0, 0.2]} material={noseBumperMat}>
        <cylinderGeometry args={[0.05, 0.05, 0.24, 16]} />
      </mesh>
      <mesh position={[0, 0, -0.3]} material={noseBumperMat}>
        <cylinderGeometry args={[0.05, 0.05, 0.24, 16]} />
      </mesh>

      {/* ===================================================
          6. SENSOR PODS & SONARS
      =================================================== */}
      {/* Bow Ping360 Forward Scanning Sonar */}
      <mesh position={[0, -0.12, 0.72]} material={thrusterBlueMat}>
        <cylinderGeometry args={[0.03, 0.03, 0.06, 16]} />
      </mesh>

      {/* Upward Ice-Tracking DVL Sonar */}
      <mesh position={[0, 0.125, -0.2]} material={hullNavyMat}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
      </mesh>

      {/* CTD Sensor Probe (PT-1000 & EZO-EC) */}
      <mesh position={[0.12, -0.15, -0.1]} material={metalKeelMat}>
        <cylinderGeometry args={[0.015, 0.015, 0.12, 16]} />
      </mesh>

      {/* ===================================================
          7. TOGGLEABLE SENSOR VISUALIZATION FOVS & VECTORS
      =================================================== */}

      {/* Forward Sonar FOV Cone */}
      {activeSensors.sonarFov && (
        <mesh position={[0, -0.12, 1.4]} rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.6, 1.4, 32, 1, true]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} wireframe={false} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Upward Ice Sonar Beam */}
      {activeSensors.upwardSonar && (
        <mesh position={[0, 1.2, -0.2]}>
          <cylinderGeometry args={[0.3, 0.04, 2.0, 16]} />
          <meshBasicMaterial color="#f43f5e" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Optical Camera FOV Pyramid */}
      {activeSensors.cameraFov && (
        <mesh position={[0, 0.6, 1.1]} rotation={[Math.PI / 2 - 0.2, 0, 0]}>
          <coneGeometry args={[0.4, 1.2, 4, 1, true]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Heading Vector Arrow */}
      {activeSensors.headingVector && (
        <group position={[0, 0, 1.2]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.5]}>
            <cylinderGeometry args={[0.01, 0.01, 1.0, 8]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1.0]}>
            <coneGeometry args={[0.04, 0.15, 8]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
        </group>
      )}

      {/* Velocity Vector */}
      {activeSensors.velocityVector && (
        <group position={[0, 0, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.8]}>
            <cylinderGeometry args={[0.008, 0.008, 1.6, 8]} />
            <meshBasicMaterial color="#2563eb" />
          </mesh>
        </group>
      )}

      {/* GNSS Range Ring */}
      {activeSensors.gnssRange && (
        <mesh position={[0, 0.8, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 0.82, 64]} />
          <meshBasicMaterial color="#10b981" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      )}

    </group>
  );
};
