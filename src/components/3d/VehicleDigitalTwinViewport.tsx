import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { SagarPrahari3DModel } from './SagarPrahari3DModel';
import { OceanEnvironment } from './OceanEnvironment';
import { TelemetryState } from '../../types/telemetry';
import { 
  Eye, 
  RotateCcw, 
  Layers, 
  Maximize2, 
  Compass, 
  Activity, 
  Camera, 
  Radio, 
  ArrowUp, 
  Zap, 
  ShieldAlert,
  Sliders
} from 'lucide-react';

interface VehicleDigitalTwinViewportProps {
  telemetry: TelemetryState;
  heightClass?: string;
}

export const VehicleDigitalTwinViewport: React.FC<VehicleDigitalTwinViewportProps> = ({
  telemetry,
  heightClass = 'h-[580px]'
}) => {
  const controlsRef = useRef<any>(null);

  // Active sensor overlay toggles
  const [activeSensors, setActiveSensors] = useState({
    sonarFov: true,
    upwardSonar: false,
    cameraFov: true,
    headingVector: true,
    velocityVector: false,
    gnssRange: true
  });

  const [showHud, setShowHud] = useState<boolean>(true);

  // Predefined camera views
  const setCameraView = (view: string) => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    
    switch (view) {
      case 'iso': // Isometric 3/4 perspective
        controls.object.position.set(3.5, 2.5, 3.5);
        controls.target.set(0, 0, 0);
        break;
      case 'top': // Top down
        controls.object.position.set(0, 5.5, 0.01);
        controls.target.set(0, 0, 0);
        break;
      case 'front': // Front bow
        controls.object.position.set(0, 0.5, 4.5);
        controls.target.set(0, 0, 0);
        break;
      case 'side': // Starboard side
        controls.object.position.set(4.5, 0.2, 0);
        controls.target.set(0, 0, 0);
        break;
      case 'rear': // Rear stern
        controls.object.position.set(0, 0.5, -4.5);
        controls.target.set(0, 0, 0);
        break;
      case 'bottom': // Bottom keel lead bulb view
        controls.object.position.set(0, -4.5, 0.01);
        controls.target.set(0, 0, 0);
        break;
      case 'submerged': // Underwater view
        controls.object.position.set(3.0, -1.8, 3.0);
        controls.target.set(0, -1.2, 0);
        break;
      default:
        controls.object.position.set(3.5, 2.5, 3.5);
        controls.target.set(0, 0, 0);
        break;
    }
    controls.update();
  };

  const toggleSensor = (key: keyof typeof activeSensors) => {
    setActiveSensors(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isSubmergedMode = telemetry.mode.includes('DIVE') || telemetry.mode.includes('SUBMERGED');

  return (
    <div className={`relative bg-slate-950 rounded-lg overflow-hidden border border-slate-700 shadow-xl ${heightClass} flex flex-col select-none`}>
      
      {/* Top Controls Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2 z-10 backdrop-blur-xs">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-200">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>SAGAR-PRAHARI 3D Digital Twin</span>
          <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 font-mono">
            60 FPS WebGL PBR Engine
          </span>
        </div>

        {/* Camera Views Selector */}
        <div className="flex items-center space-x-1.5 text-xs font-mono">
          <span className="text-slate-400 text-[10px] font-sans mr-1 hidden sm:inline">Camera Preset:</span>
          <button onClick={() => setCameraView('iso')} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[10px]">
            Isometric
          </button>
          <button onClick={() => setCameraView('top')} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[10px]">
            Top
          </button>
          <button onClick={() => setCameraView('front')} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[10px]">
            Front
          </button>
          <button onClick={() => setCameraView('side')} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[10px]">
            Side
          </button>
          <button onClick={() => setCameraView('bottom')} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[10px]">
            Bottom
          </button>
          <button onClick={() => setCameraView('submerged')} className="px-2 py-0.5 bg-cyan-950 hover:bg-cyan-900 text-cyan-300 rounded border border-cyan-700 text-[10px] font-bold">
            Underwater
          </button>
          <button onClick={() => setCameraView('iso')} className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded" title="Reset Camera">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main WebGL 3D Canvas */}
      <div className="relative flex-1 bg-gradient-to-b from-slate-950 via-slate-900 to-[#0a192f]">
        
        <Canvas>
          <PerspectiveCamera makeDefault position={[3.5, 2.5, 3.5]} fov={45} />
          <OrbitControls 
            ref={controlsRef} 
            enablePan={true} 
            enableZoom={true} 
            minDistance={1.2} 
            maxDistance={12} 
            maxPolarAngle={Math.PI - 0.1}
          />
          
          {/* Lighting */}
          <ambientLight intensity={1.2} />
          <directionalLight position={[10, 15, 10]} intensity={2.0} castShadow />
          <directionalLight position={[-10, -10, -10]} intensity={0.5} />
          <pointLight position={[0, 3, 0]} intensity={1.5} color="#38bdf8" />
          
          {/* Water & Ocean Environment */}
          <OceanEnvironment isSubmerged={isSubmergedMode} />

          {/* SAGAR-PRAHARI Procedural PBR 3D Vehicle */}
          <SagarPrahari3DModel
            mode={telemetry.mode}
            propellerSpeed={telemetry.speedMs}
            showLabels={showHud}
            activeSensors={activeSensors}
          />
        </Canvas>

        {/* Floating Telemetry HUD Overlay */}
        {showHud && (
          <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700 text-white p-3 rounded-md text-xs font-mono backdrop-blur-xs shadow-xl w-60 z-10 pointer-events-none">
            <div className="font-bold text-cyan-400 border-b border-slate-700 pb-1 mb-2 flex justify-between">
              <span>{telemetry.vehicleId} DIGITAL TWIN</span>
              <span className="text-[10px] text-emerald-400">{telemetry.mode}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px]">
              <div><span className="text-slate-400 font-sans">Heading:</span> {telemetry.headingDeg}°</div>
              <div><span className="text-slate-400 font-sans">Speed:</span> {telemetry.speedMs} m/s</div>
              <div><span className="text-slate-400 font-sans">Depth:</span> {telemetry.depthMeters} m</div>
              <div><span className="text-slate-400 font-sans">Battery:</span> {telemetry.mainBatterySOC}%</div>
              <div><span className="text-slate-400 font-sans">Roll / Pitch:</span> {telemetry.rollDeg}° / {telemetry.pitchDeg}°</div>
              <div><span className="text-slate-400 font-sans">GNSS Fix:</span> {telemetry.gnssQuality}</div>
              <div><span className="text-slate-400 font-sans">Pod Temp:</span> {telemetry.electronicsPodTempC} °C</div>
              <div><span className="text-slate-400 font-sans">Leak:</span> <span className="text-emerald-400 font-bold">{telemetry.leakStatus}</span></div>
            </div>
          </div>
        )}

        {/* Interactive Sensor Overlay Toggle Buttons (Bottom Overlay) */}
        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 border border-slate-800 p-2 rounded-md backdrop-blur-xs z-10 flex flex-wrap items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-[10px] uppercase font-sans font-bold">Sensor Layer Toggles:</span>
            
            <button
              onClick={() => toggleSensor('sonarFov')}
              className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                activeSensors.sonarFov ? 'bg-sky-900 text-sky-300 border-sky-600' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              Forward Sonar FOV
            </button>

            <button
              onClick={() => toggleSensor('upwardSonar')}
              className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                activeSensors.upwardSonar ? 'bg-rose-950 text-rose-300 border-rose-700' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              Upward Ice Sonar
            </button>

            <button
              onClick={() => toggleSensor('cameraFov')}
              className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                activeSensors.cameraFov ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              Camera FOV
            </button>

            <button
              onClick={() => toggleSensor('headingVector')}
              className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                activeSensors.headingVector ? 'bg-amber-950 text-amber-300 border-amber-700' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              Heading Vector
            </button>

            <button
              onClick={() => toggleSensor('gnssRange')}
              className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                activeSensors.gnssRange ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              GNSS Ring
            </button>
          </div>

          <button
            onClick={() => setShowHud(!showHud)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 text-[10px] font-bold"
          >
            {showHud ? 'Hide Telemetry Overlay' : 'Show Telemetry Overlay'}
          </button>
        </div>

      </div>

    </div>
  );
};
