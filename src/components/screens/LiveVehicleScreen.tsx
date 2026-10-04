import React from 'react';
import { TelemetryState } from '../../types/telemetry';
import { VehicleDigitalTwinViewport } from '../3d/VehicleDigitalTwinViewport';
import { Navigation, Gauge, Cpu, Battery, Radio, ShieldCheck, Activity, RotateCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface LiveVehicleScreenProps {
  telemetry: TelemetryState;
  history24h: any[];
}

export const LiveVehicleScreen: React.FC<LiveVehicleScreenProps> = ({ telemetry, history24h }) => {
  return (
    <div className="space-y-4">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            <span>Live Vehicle Digital Twin & Telemetry — {telemetry.vehicleId}</span>
          </h2>
          <p className="text-xs text-slate-500">
            High-Fidelity 3D WebGL Representation • Monohull Observation Platform (1.45 m prototype / 61.1 kg)
          </p>
        </div>
        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded font-bold">
            • {telemetry.mode}
          </span>
          <span className="text-slate-400">Last Sync: {telemetry.timestampUTC.slice(-12)}</span>
        </div>
      </div>

      {/* Main Grid Layout: Large 3D Viewport (Left/Center) & Telemetry Stack (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT / CENTER: Large 3D Vehicle Digital Twin Viewport (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="dashboard-card p-3 flex-1 flex flex-col">
            <VehicleDigitalTwinViewport 
              telemetry={telemetry} 
              heightClass="h-[580px]" 
            />
          </div>
        </div>

        {/* RIGHT: Real-time Engineering Telemetry Stack (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Kinematics & Position */}
          <div className="dashboard-card p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">
              Pose & Kinematics
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-50 p-2 rounded">
                <div className="text-[10px] text-slate-500 font-sans">Heading</div>
                <div className="text-base font-bold text-slate-900">{telemetry.headingDeg}°</div>
              </div>

              <div className="bg-slate-50 p-2 rounded">
                <div className="text-[10px] text-slate-500 font-sans">Speed</div>
                <div className="text-base font-bold text-slate-900">{telemetry.speedMs} m/s</div>
              </div>

              <div className="bg-slate-50 p-2 rounded">
                <div className="text-[10px] text-slate-500 font-sans">Depth (Bar30)</div>
                <div className="text-base font-bold text-cyan-700">{telemetry.depthMeters} m</div>
              </div>

              <div className="bg-slate-50 p-2 rounded">
                <div className="text-[10px] text-slate-500 font-sans">GNSS Quality</div>
                <div className="text-base font-bold text-emerald-700">{telemetry.gnssQuality}</div>
              </div>

              <div className="bg-slate-50 p-2 rounded">
                <div className="text-[10px] text-slate-500 font-sans">Roll Angle</div>
                <div className="text-base font-bold text-slate-800">{telemetry.rollDeg}°</div>
              </div>

              <div className="bg-slate-50 p-2 rounded">
                <div className="text-[10px] text-slate-500 font-sans">Pitch Angle</div>
                <div className="text-base font-bold text-slate-800">{telemetry.pitchDeg}°</div>
              </div>
            </div>
          </div>

          {/* Battery State */}
          <div className="dashboard-card p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2 flex justify-between">
              <span>Main Battery (Bus A)</span>
              <span className="text-blue-600 font-mono">{telemetry.mainBatterySOC}% SOC</span>
            </h3>

            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${telemetry.mainBatterySOC}%` }} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-50 p-2 rounded">
                <div className="text-[10px] text-slate-500 font-sans">Bus Voltage / Current</div>
                <div className="font-bold text-slate-900">{telemetry.mainBusVoltageV} V / {telemetry.mainBusCurrentA} A</div>
              </div>
              <div className="bg-slate-50 p-2 rounded">
                <div className="text-[10px] text-slate-500 font-sans">Remaining Energy</div>
                <div className="font-bold text-slate-900">{telemetry.mainBatteryRemainingWh} / 1152 Wh</div>
              </div>
            </div>
          </div>

          {/* Environmental Pod Temperature & Leak State */}
          <div className="dashboard-card p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">
              Diagnostics & Pod Health
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between bg-slate-50 p-2 rounded">
                <span className="text-slate-500 font-sans">Main Computer Temp:</span>
                <span className="font-bold text-slate-900">{telemetry.mainComputerTempC} °C</span>
              </div>
              <div className="flex justify-between bg-slate-50 p-2 rounded">
                <span className="text-slate-500 font-sans">Electronics Pod Temp:</span>
                <span className="font-bold text-slate-900">{telemetry.electronicsPodTempC} °C</span>
              </div>
              <div className="flex justify-between bg-slate-50 p-2 rounded">
                <span className="text-slate-500 font-sans">Wet Leak Sensors:</span>
                <span className="font-bold text-emerald-600">{telemetry.leakStatus}</span>
              </div>
              <div className="flex justify-between bg-slate-50 p-2 rounded">
                <span className="text-slate-500 font-sans">Iridium Signal:</span>
                <span className="font-bold text-blue-700">5/5 Bars</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM: Thruster Telemetry & Small Timeline Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Thrusters Registry (8 Cols) */}
        <div className="lg:col-span-8 dashboard-card p-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Propulsion Actuators (4 × Blue Robotics T200)
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            {[
              { name: 'Port Aft T200 #1', pwm: 1620, current: 0.85, status: 'NORMAL' },
              { name: 'Stbd Aft T200 #2', pwm: 1618, current: 0.84, status: 'NORMAL' },
              { name: 'Vert Dive T200 #3', pwm: 1500, current: 0.00, status: 'STANDBY' },
              { name: 'Vert Dive T200 #4', pwm: 1500, current: 0.00, status: 'STANDBY' },
            ].map((th, i) => (
              <div key={i} className="bg-slate-50 p-2 rounded border border-slate-200">
                <div className="font-bold text-slate-900 text-[11px] font-sans">{th.name}</div>
                <div className="flex justify-between text-[10px] mt-1">
                  <span className="text-slate-500">PWM:</span>
                  <span className="font-bold">{th.pwm} µs</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-500">Current:</span>
                  <span className="font-bold text-blue-700">{th.current} A</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Small Live Telemetry Stream (4 Cols) */}
        <div className="lg:col-span-4 dashboard-card p-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Speed & Depth Timeline Stream
          </h3>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history24h.slice(-8)}>
                <XAxis dataKey="timestampUTC" stroke="#94a3b8" fontSize={9} />
                <YAxis stroke="#2563eb" fontSize={9} />
                <Tooltip />
                <Line type="monotone" dataKey="windSpeedMs" name="Speed (m/s)" stroke="#2563eb" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
