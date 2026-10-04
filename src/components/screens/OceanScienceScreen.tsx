import React, { useState } from 'react';
import { TelemetryState } from '../../types/telemetry';
import { Droplets, Thermometer, Activity, LineChart as ChartIcon, FileSpreadsheet, CheckCircle2, ShieldCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface OceanScienceScreenProps {
  telemetry: TelemetryState;
  history24h: any[];
}

export const OceanScienceScreen: React.FC<OceanScienceScreenProps> = ({ telemetry, history24h }) => {
  const [selectedParam, setSelectedParam] = useState<'waterTempC' | 'salinityPSU' | 'turbidityNTU'>('waterTempC');
  const [activeTab, setActiveTab] = useState<'overview' | 'timeseries' | 'profiles' | 'datatable'>('overview');

  return (
    <div className="space-y-4">
      
      {/* Header Banner */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-cyan-600" />
            <span>Oceanographic Science Measurements (TEOS-10 Standards)</span>
          </h2>
          <p className="text-xs text-slate-500">
            NCPOR Polar Science Protocol • PT-1000 Temp Sensor • EZO-EC Conductivity • Bar30 Pressure Pod
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setActiveTab('overview')} 
            className={`px-3 py-1 rounded text-xs font-semibold ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('timeseries')} 
            className={`px-3 py-1 rounded text-xs font-semibold ${activeTab === 'timeseries' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Time Series
          </button>
          <button 
            onClick={() => setActiveTab('datatable')} 
            className={`px-3 py-1 rounded text-xs font-semibold ${activeTab === 'datatable' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            Data Table
          </button>
        </div>
      </div>

      {/* Core MVP Science Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        {/* Water Temp */}
        <div className="dashboard-card p-3 border-l-4 border-l-cyan-600">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-slate-700">Water Temperature</span>
            <span className="text-[10px] font-mono bg-cyan-100 text-cyan-800 px-1.5 py-0.5 rounded">MVP</span>
          </div>
          <div className="text-2xl font-black text-cyan-950 font-mono mt-1">{telemetry.waterTempC} °C</div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">Sensor: PT-1000 RTD (±0.15 °C)</div>
        </div>

        {/* Salinity */}
        <div className="dashboard-card p-3 border-l-4 border-l-blue-600">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-slate-700">Practical Salinity</span>
            <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">MVP</span>
          </div>
          <div className="text-2xl font-black text-blue-950 font-mono mt-1">{telemetry.practicalSalinityPSU} PSU</div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">Sensor: EZO-EC (±2%)</div>
        </div>

        {/* Turbidity */}
        <div className="dashboard-card p-3 border-l-4 border-l-indigo-600">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-slate-700">Turbidity</span>
            <span className="text-[10px] font-mono bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">MVP</span>
          </div>
          <div className="text-2xl font-black text-indigo-950 font-mono mt-1">{telemetry.turbidityNTU} NTU</div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">Sensor: Optical Backscatter</div>
        </div>

        {/* Chlorophyll-a */}
        <div className="dashboard-card p-3 border-l-4 border-l-emerald-600">
          <div className="flex justify-between text-xs">
            <span className="font-bold text-slate-700">Chlorophyll-a</span>
            <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Field Tier</span>
          </div>
          <div className="text-2xl font-black text-emerald-950 font-mono mt-1">{telemetry.chlorophyllUgl} µg/L</div>
          <div className="text-[10px] text-slate-500 mt-1 font-mono">Fluorometer Pod</div>
        </div>

      </div>

      {/* Secondary Parameters Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded border border-slate-200">
          <div className="text-[10px] text-slate-500 font-semibold uppercase">pH (EZO-pH Glass)</div>
          <div className="text-lg font-bold text-indigo-900 font-mono mt-0.5">{telemetry.phValue}</div>
          <div className="text-[9px] text-emerald-600 font-mono">QC: Good</div>
        </div>

        <div className="bg-white p-3 rounded border border-slate-200">
          <div className="text-[10px] text-slate-500 font-semibold uppercase">Dissolved Oxygen</div>
          <div className="text-lg font-bold text-teal-900 font-mono mt-0.5">{telemetry.dissolvedOxygenMgL} mg/L</div>
          <div className="text-[9px] text-emerald-600 font-mono">QC: Good</div>
        </div>

        <div className="bg-white p-3 rounded border border-slate-200">
          <div className="text-[10px] text-slate-500 font-semibold uppercase">Electrical Conductivity</div>
          <div className="text-lg font-bold text-blue-900 font-mono mt-0.5">{telemetry.conductivityMSCm} mS/cm</div>
          <div className="text-[9px] text-emerald-600 font-mono">TEOS-10 Standard</div>
        </div>

        <div className="bg-white p-3 rounded border border-slate-200">
          <div className="text-[10px] text-slate-500 font-semibold uppercase">Oxidation Reduction (ORP)</div>
          <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">{telemetry.orpMV} mV</div>
          <div className="text-[9px] text-emerald-600 font-mono">QC: Good</div>
        </div>
      </div>

      {/* Parameter Trends Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Main Parameter Time Series Chart (8 Cols) */}
        <div className="lg:col-span-8 dashboard-card p-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
              <ChartIcon className="w-4 h-4 text-blue-600" />
              <span>Parameter Trends (Last 24 Hours)</span>
            </h3>

            {/* Parameter Switcher */}
            <div className="flex items-center space-x-2 text-xs">
              <button 
                onClick={() => setSelectedParam('waterTempC')}
                className={`px-2 py-0.5 rounded font-mono ${selectedParam === 'waterTempC' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                Temp (°C)
              </button>
              <button 
                onClick={() => setSelectedParam('salinityPSU')}
                className={`px-2 py-0.5 rounded font-mono ${selectedParam === 'salinityPSU' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                Salinity (PSU)
              </button>
              <button 
                onClick={() => setSelectedParam('turbidityNTU')}
                className={`px-2 py-0.5 rounded font-mono ${selectedParam === 'turbidityNTU' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                Turbidity (NTU)
              </button>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history24h}>
                <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey={selectedParam} 
                  name={selectedParam === 'waterTempC' ? 'Water Temp (°C)' : selectedParam === 'salinityPSU' ? 'Salinity (PSU)' : 'Turbidity (NTU)'} 
                  stroke="#0284c7" 
                  fill="#e0f2fe" 
                  strokeWidth={2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Latest Readings Summary Table (4 Cols) */}
        <div className="lg:col-span-4 dashboard-card p-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">
            Latest Sample Data Table
          </h3>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between bg-slate-50 p-2 rounded">
              <span className="text-slate-600 font-sans">Water Temp (PT-1000):</span>
              <span className="font-bold text-slate-900">-1.6 °C</span>
            </div>
            <div className="flex justify-between bg-slate-50 p-2 rounded">
              <span className="text-slate-600 font-sans">Practical Salinity:</span>
              <span className="font-bold text-slate-900">34.2 PSU</span>
            </div>
            <div className="flex justify-between bg-slate-50 p-2 rounded">
              <span className="text-slate-600 font-sans">Turbidity:</span>
              <span className="font-bold text-slate-900">0.8 NTU</span>
            </div>
            <div className="flex justify-between bg-slate-50 p-2 rounded">
              <span className="text-slate-600 font-sans">Chlorophyll-a:</span>
              <span className="font-bold text-emerald-700">1.2 µg/L</span>
            </div>
            <div className="flex justify-between bg-slate-50 p-2 rounded">
              <span className="text-slate-600 font-sans">pH Value:</span>
              <span className="font-bold text-slate-900">8.1</span>
            </div>
            <div className="flex justify-between bg-slate-50 p-2 rounded">
              <span className="text-slate-600 font-sans">Dissolved Oxygen:</span>
              <span className="font-bold text-slate-900">7.4 mg/L</span>
            </div>
            <div className="flex justify-between bg-slate-50 p-2 rounded">
              <span className="text-slate-600 font-sans">Conductivity:</span>
              <span className="font-bold text-slate-900">45.8 mS/cm</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
