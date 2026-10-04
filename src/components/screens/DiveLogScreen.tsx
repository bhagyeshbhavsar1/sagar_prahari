import React, { useState } from 'react';
import { DiveRecord } from '../../types/telemetry';
import { Anchor, TrendingDown, Clock, ShieldCheck, Download, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DiveLogScreenProps {
  diveLogs: DiveRecord[];
}

export const DiveLogScreen: React.FC<DiveLogScreenProps> = ({ diveLogs }) => {
  const [selectedDiveId, setSelectedDiveId] = useState<number>(diveLogs[0]?.id || 12);
  const currentDive = diveLogs.find(d => d.id === selectedDiveId) || diveLogs[0];

  const totalDives = 12;
  const maxDepthOverall = 5.2;
  const avgDuration = 86;

  return (
    <div className="space-y-4">
      
      {/* Top Banner */}
      <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Anchor className="w-4 h-4 text-blue-600" />
            <span>Under-Ice Dive Log & Vertical Depth Profiles</span>
          </h2>
          <p className="text-xs text-slate-500">
            Pneumatic Ballast Tank (MBT) Dives • 6 m Maximum Prototype Depth Envelope • Positive Buoyancy Failsafe
          </p>
        </div>
        <button className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold border border-slate-300">
          <Download className="w-3.5 h-3.5" />
          <span>Export Dive Logs (.CSV)</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="dashboard-card p-3 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <Anchor className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Total Dives Completed</div>
            <div className="text-xl font-black text-slate-900 font-mono">{totalDives}</div>
          </div>
        </div>

        <div className="dashboard-card p-3 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Last Dive Time</div>
            <div className="text-xs font-bold text-slate-900 font-mono">03 Oct 2026</div>
            <div className="text-[10px] text-slate-400 font-mono">07:14 UTC</div>
          </div>
        </div>

        <div className="dashboard-card p-3 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Max Depth Attained</div>
            <div className="text-xl font-black text-cyan-800 font-mono">{maxDepthOverall} m</div>
          </div>
        </div>

        <div className="dashboard-card p-3 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Avg Dive Duration</div>
            <div className="text-xl font-black text-indigo-900 font-mono">{avgDuration} s</div>
          </div>
        </div>
      </div>

      {/* Dive Profile Chart & Detailed Dive Inspection (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Latest Dive Profile Chart (7 Cols) */}
        <div className="lg:col-span-7 dashboard-card p-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-blue-600" />
              <span>Dive Profile — Dive #{currentDive.id} ({currentDive.purpose})</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">Duration: {currentDive.durationSeconds} s</span>
          </div>

          {/* Depth vs Time Area Chart (Inverted Y axis for depth underwater) */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentDive.profilePoints}>
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} label={{ value: 'Time (seconds)', position: 'insideBottom', offset: -2, fontSize: 11 }} />
                <YAxis reversed stroke="#64748b" fontSize={11} label={{ value: 'Depth (m)', angle: -90, position: 'insideLeft', fontSize: 11 }} domain={[0, 6]} />
                <Tooltip />
                <Area type="monotone" dataKey="depth" name="Depth (m)" stroke="#0284c7" fill="#bae6fd" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Dive Parameters Details */}
          <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-mono">
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <div className="text-[10px] text-slate-500 font-sans">Max Dive Depth</div>
              <div className="font-bold text-slate-900">{currentDive.maxDepthMeters} m</div>
            </div>

            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <div className="text-[10px] text-slate-500 font-sans">Min Ice Clearance</div>
              <div className="font-bold text-emerald-700">{currentDive.minBottomClearanceMeters} m</div>
            </div>

            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <div className="text-[10px] text-slate-500 font-sans">Dead Reckoning Error</div>
              <div className="font-bold text-slate-900">{currentDive.deadReckoningErrorMeters} m</div>
            </div>
          </div>
        </div>

        {/* Dive History Table (5 Cols) */}
        <div className="lg:col-span-5 dashboard-card p-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
            Historical Dive Registry
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 text-[10px]">
                  <th className="p-2">#</th>
                  <th className="p-2">Date (UTC)</th>
                  <th className="p-2">Depth (m)</th>
                  <th className="p-2">Dur (s)</th>
                  <th className="p-2">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {diveLogs.map((d) => (
                  <tr 
                    key={d.id} 
                    onClick={() => setSelectedDiveId(d.id)}
                    className={`cursor-pointer transition-colors ${selectedDiveId === d.id ? 'bg-blue-50 font-bold text-blue-900' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <td className="p-2">{d.id}</td>
                    <td className="p-2 text-[10px]">{d.startTimeUTC.slice(5, 16)}</td>
                    <td className="p-2">{d.maxDepthMeters}</td>
                    <td className="p-2">{d.durationSeconds}</td>
                    <td className="p-2 font-sans text-[11px] truncate max-w-[120px]">{d.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
