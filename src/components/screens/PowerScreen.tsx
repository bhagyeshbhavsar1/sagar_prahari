import React from 'react';
import { TelemetryState } from '../../types/telemetry';
import { Zap, Battery, Sun, ShieldCheck, Activity, PieChart as PieIcon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PowerScreenProps {
  telemetry: TelemetryState;
  history24h: any[];
}

export const PowerScreen: React.FC<PowerScreenProps> = ({ telemetry, history24h }) => {
  // Energy Breakdown Donut Data
  const energyData = [
    { name: 'Propulsion', value: 42, color: '#2563eb' },
    { name: 'Compute', value: 18, color: '#0284c7' },
    { name: 'Sensors', value: 15, color: '#10b981' },
    { name: 'Communications', value: 8, color: '#8b5cf6' },
    { name: 'Others / Misc', value: 17, color: '#64748b' }
  ];

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Power & Energy Architecture (Dual Isolated Bus)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Main Propulsion & Compute Bus A (1.15 kWh LiFePO4) • Sentinel Bus B (376 Wh Independent) • Deck Solar MPPT
          </p>
        </div>
        <div className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded font-bold">
          Estimated Endurance: ~3.2 days (at 0.6 m/s transit)
        </div>
      </div>

      {/* Top Cards: Power System Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        
        {/* Main Battery Bus A */}
        <div className="dashboard-card p-3">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="font-bold text-slate-800">Main Battery (Propulsion + Compute)</span>
            <span className="font-mono font-bold text-blue-600">{telemetry.mainBatterySOC}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-blue-600" style={{ width: `${telemetry.mainBatterySOC}%` }} />
          </div>
          <div className="text-[11px] font-mono text-slate-600 space-y-0.5">
            <div>0.82 / 1.15 kWh</div>
            <div className="text-slate-400 text-[10px]">{telemetry.mainBusVoltageV} V • {telemetry.mainBusCurrentA} A</div>
          </div>
        </div>

        {/* Sentinel Bus B */}
        <div className="dashboard-card p-3">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="font-bold text-slate-800">Sentinel Battery (Sampling + Comms)</span>
            <span className="font-mono font-bold text-emerald-600">{telemetry.sentinelBusSOC}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-emerald-600" style={{ width: `${telemetry.sentinelBusSOC}%` }} />
          </div>
          <div className="text-[11px] font-mono text-slate-600 space-y-0.5">
            <div>362 / 376 Wh</div>
            <div className="text-slate-400 text-[10px]">Isolated 7.2 V Sentinel Rail</div>
          </div>
        </div>

        {/* Solar Input Deck */}
        <div className="dashboard-card p-3">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="font-bold text-slate-800">Solar Input (Deck Panels)</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-black text-amber-600 font-mono">{telemetry.solarInputWatts} W</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            Peak: {telemetry.solarPeakWatts} W • Daily: {telemetry.solarDailyWh / 1000} kWh
          </div>
        </div>

        {/* Total Power Draw */}
        <div className="dashboard-card p-3">
          <div className="flex items-center justify-between mb-1 text-xs">
            <span className="font-bold text-slate-800">Total System Power Draw</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">{telemetry.mainBusPowerW} W</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">
            Hotel Load: 21.0 W • Propulsion: 56 W
          </div>
        </div>

      </div>

      {/* Main Grid: Power Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Power Consumption Area Chart (7 Cols) */}
        <div className="lg:col-span-7 dashboard-card p-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">
            Power Consumption (Last 24 Hours)
          </h3>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history24h}>
                <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} label={{ value: 'Power (W)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="mainBusPowerW" name="Total Power (W)" stroke="#2563eb" fill="#dbeafe" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Energy Breakdown Donut Chart (5 Cols) */}
        <div className="lg:col-span-5 dashboard-card p-4 flex flex-col justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">
            Energy Breakdown (Last 24 h)
          </h3>

          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={energyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {energyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono border-t border-slate-100 pt-2">
            {energyData.map((item, i) => (
              <div key={i} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 font-sans text-[11px]">{item.name}:</span>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Solar Generation Curve (Full Width) */}
      <div className="dashboard-card p-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">
          Deck Solar Generation Profile (24 Hours)
        </h3>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history24h}>
              <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={10} />
              <YAxis stroke="#64748b" fontSize={10} label={{ value: 'Solar (W)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="solarWatts" name="Solar Input (W)" stroke="#f59e0b" fill="#fef3c7" fillOpacity={0.7} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
