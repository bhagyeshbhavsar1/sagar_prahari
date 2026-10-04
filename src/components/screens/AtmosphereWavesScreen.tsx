import React from 'react';
import { TelemetryState } from '../../types/telemetry';
import { CloudRain, Wind, Thermometer, Gauge, Activity, Navigation } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface AtmosphereWavesScreenProps {
  telemetry: TelemetryState;
  history24h: any[];
}

export const AtmosphereWavesScreen: React.FC<AtmosphereWavesScreenProps> = ({ telemetry, history24h }) => {
  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <CloudRain className="w-4 h-4 text-blue-600" />
            <span>Atmospheric & Wave Dynamics (Mast Pod Sensors)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Mast Air PT-1000 • Barometer • Ultrasonic Anemometer • IMU Wave Spectrum Processing
          </p>
        </div>
        <div className="text-xs font-mono text-slate-500">
          Last update: {telemetry.timestampUTC.slice(-12)}
        </div>
      </div>

      {/* Top Parameter Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        
        {/* Air Temp */}
        <div className="dashboard-card p-3">
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Air Temperature</div>
          <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">{telemetry.airTempC} °C</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">Range: -12.8°C to +1.1°C</div>
        </div>

        {/* Relative Humidity */}
        <div className="dashboard-card p-3">
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Relative Humidity</div>
          <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">{telemetry.relativeHumidityPct} %</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">Capacitive Sensor</div>
        </div>

        {/* Atmospheric Pressure */}
        <div className="dashboard-card p-3">
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Atmospheric Pressure</div>
          <div className="text-xl font-bold text-slate-900 font-mono mt-0.5">{telemetry.airPressureHpa} hPa</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">Barometer Pod</div>
        </div>

        {/* Wind Speed */}
        <div className="dashboard-card p-3">
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Wind Speed</div>
          <div className="text-xl font-bold text-blue-700 font-mono mt-0.5">{telemetry.windSpeedMs} m/s</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">Ultrasonic Anemometer</div>
        </div>

        {/* Wind Direction */}
        <div className="dashboard-card p-3">
          <div className="text-[10px] text-slate-500 uppercase font-semibold">Wind Direction</div>
          <div className="text-base font-bold text-slate-900 font-mono mt-0.5">{telemetry.windDirectionText}</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">Vector Relative</div>
        </div>

      </div>

      {/* Wave Parameters Section */}
      <div className="dashboard-card p-4">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-600" />
          <span>Surface Ocean Wave Parameters (Derived from Motion Spectrum)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <div className="text-xs font-sans text-slate-500 font-medium">Significant Wave Height (Hs)</div>
            <div className="text-2xl font-bold text-cyan-900 mt-1">{telemetry.significantWaveHeightM} m</div>
            <div className="text-[10px] text-slate-400 mt-1">Industrial IMU Acceleration</div>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <div className="text-xs font-sans text-slate-500 font-medium">Peak Wave Period (Tp)</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{telemetry.peakWavePeriodS} s</div>
            <div className="text-[10px] text-slate-400 mt-1">Wave Spectrum Peak</div>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200">
            <div className="text-xs font-sans text-slate-500 font-medium">Dominant Wave Direction</div>
            <div className="text-xl font-bold text-slate-900 mt-1">{telemetry.waveDirectionText}</div>
            <div className="text-[10px] text-slate-400 mt-1">Directional Wave Spectrum</div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Air Temperature Chart */}
        <div className="dashboard-card p-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">
            Air Temperature (24 h Trend)
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history24h}>
                <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} domain={[-15, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="airTempC" name="Air Temp (°C)" stroke="#2563eb" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wind Speed Chart */}
        <div className="dashboard-card p-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">
            Wind Speed (24 h Trend)
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history24h}>
                <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} domain={[0, 25]} />
                <Tooltip />
                <Line type="monotone" dataKey="windSpeedMs" name="Wind Speed (m/s)" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
