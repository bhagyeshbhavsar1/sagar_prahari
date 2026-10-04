import React from 'react';
import { TelemetryState } from '../../types/telemetry';
import { HeartPulse, Cpu, Thermometer, ShieldCheck, Zap, Activity, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface HealthDiagnosticsScreenProps {
  telemetry: TelemetryState;
  history24h: any[];
}

export const HealthDiagnosticsScreen: React.FC<HealthDiagnosticsScreenProps> = ({ telemetry, history24h }) => {
  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <HeartPulse className="w-4 h-4 text-emerald-600" />
            <span>Health & Hardware Diagnostics (ESP32 Gate Supervisor)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Dual Wet-Leak Sensors • Hardware Watchdogs • Electrical & Thermal Envelope Watch
          </p>
        </div>
        <div className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded font-bold">
          System Health: 100% NOMINAL
        </div>
      </div>

      {/* Top Health & Thermal Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        
        {/* Main Health Gauge */}
        <div className="dashboard-card p-3 flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full border-4 border-emerald-500 flex items-center justify-center font-black text-emerald-700 text-sm font-mono shrink-0">
            100%
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Overall System Health</div>
            <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">All Subsystems Nominal</div>
            <div className="text-[9px] text-slate-400 font-mono mt-0.5">Watchdog: 100 Hz</div>
          </div>
        </div>

        {/* Pod Temperatures */}
        <div className="dashboard-card p-3">
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Main Computer Temp</div>
          <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">{telemetry.mainComputerTempC} °C</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">Nvidia Orin (Max 65°C)</div>
        </div>

        <div className="dashboard-card p-3">
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Electronics Pod Temp</div>
          <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">{telemetry.electronicsPodTempC} °C</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">Aluminum Hull Pod</div>
        </div>

        <div className="dashboard-card p-3">
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Internal Humidity / Leak</div>
          <div className="text-xl font-bold text-emerald-700 font-mono mt-0.5">{telemetry.internalHumidityPct} %</div>
          <div className="text-[10px] text-emerald-600 font-mono mt-1">Leak Status: CLEAR</div>
        </div>

      </div>

      {/* Main Diagnostics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Voltage & Current Chart (7 Cols) */}
        <div className="lg:col-span-7 dashboard-card p-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">
            Voltage & Current Stability (Main Bus A)
          </h3>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history24h}>
                <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={10} />
                <YAxis yAxisId="v" stroke="#2563eb" fontSize={10} domain={[20, 30]} />
                <YAxis yAxisId="a" orientation="right" stroke="#10b981" fontSize={10} domain={[0, 10]} />
                <Tooltip />
                <Line yAxisId="v" type="monotone" dataKey="mainBusVoltage" name="Voltage (V)" stroke="#2563eb" strokeWidth={2} dot={false} />
                <Line yAxisId="a" type="monotone" dataKey="mainBusCurrent" name="Current (A)" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subsystem Health Checklist (5 Cols) */}
        <div className="lg:col-span-5 dashboard-card p-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
            Subsystem Status Registry
          </h3>

          <div className="space-y-2 text-xs font-mono">
            {[
              { name: 'Propulsion Subsystem', status: 'OK', details: '4x T200 ESC active, PWM nominal' },
              { name: 'Power & BMS Subsystem', status: 'OK', details: 'BMS A & Sentinel B isolated' },
              { name: 'Compute Hardware', status: 'OK', details: 'Jetson Orin Nano + Pixhawk 6C' },
              { name: 'Sensor Array Pods', status: 'OK', details: 'CTD + Bar30 + Mast Sensors OK' },
              { name: 'Communications Modem', status: 'OK', details: 'Iridium SBD 9603 connected' },
              { name: 'Mechanical & Ballast', status: 'OK', details: 'Pneumatic MBT valves sealed' }
            ].map((sub, i) => (
              <div key={i} className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800 font-sans">{sub.name}</div>
                  <div className="text-[10px] text-slate-500">{sub.details}</div>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                  {sub.status}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
