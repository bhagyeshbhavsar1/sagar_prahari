import React from 'react';
import { TelemetryState, Waypoint, IceHazard } from '../../types/telemetry';
import { AntarcticMissionMap } from '../map/AntarcticMissionMap';
import { Route, Navigation, Shield, Compass, BarChart2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TrackUncertaintyScreenProps {
  telemetry: TelemetryState;
  waypoints: Waypoint[];
  hazards: IceHazard[];
  history24h: any[];
}

export const TrackUncertaintyScreen: React.FC<TrackUncertaintyScreenProps> = ({
  telemetry,
  waypoints,
  hazards,
  history24h
}) => {
  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Route className="w-4 h-4 text-blue-600" />
            <span>Track & Navigation Uncertainty (Kalman Filter Covariance)</span>
          </h2>
          <p className="text-xs text-slate-500">
            DGNSS / RTK + Dead Reckoning • 1σ/2σ Uncertainty Ellipse Bounds • Under-Ice Segments
          </p>
        </div>
        <div className="text-xs font-mono bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded font-bold">
          Fix Source: {telemetry.gnssSource}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Map View (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="dashboard-card p-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Track Corridor & Covariance Ellipses
            </h3>
            <AntarcticMissionMap 
              telemetry={telemetry} 
              waypoints={waypoints} 
              hazards={hazards}
              showUncertainty={true}
              heightClass="h-[460px]"
            />
          </div>
        </div>

        {/* Right Statistics & Uncertainty Charts (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Position Uncertainty Chart */}
          <div className="dashboard-card p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2 flex justify-between">
              <span>Position Uncertainty (24 h Trend)</span>
              <span className="font-mono text-blue-600">Current 1σ: {telemetry.uncertainty1sigmaKm} km</span>
            </h3>

            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history24h}>
                  <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} label={{ value: 'Uncertainty (km)', angle: -90, position: 'insideLeft', fontSize: 10 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="uncertainty1sigma" name="1σ Bound (68%)" stroke="#2563eb" fill="#bfdbfe" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-50 p-2 rounded">
                <div className="text-[10px] text-slate-500 font-sans">Current 1σ Covariance</div>
                <div className="font-bold text-slate-900">{telemetry.uncertainty1sigmaKm} km</div>
              </div>
              <div className="bg-slate-50 p-2 rounded">
                <div className="text-[10px] text-slate-500 font-sans">Current 2σ Covariance (95%)</div>
                <div className="font-bold text-blue-700">{telemetry.uncertainty2sigmaKm} km</div>
              </div>
            </div>
          </div>

          {/* Track Statistics */}
          <div className="dashboard-card p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
              Track Metrics & Performance
            </h3>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between bg-slate-50 p-2 rounded">
                <span className="text-slate-600 font-sans">Total Distance Traveled (24h):</span>
                <span className="font-bold text-slate-900">{telemetry.distanceTraveledKm} km</span>
              </div>

              <div className="flex justify-between bg-slate-50 p-2 rounded">
                <span className="text-slate-600 font-sans">Average Transit Speed:</span>
                <span className="font-bold text-slate-900">{telemetry.avgSpeedMs} m/s</span>
              </div>

              <div className="flex justify-between bg-slate-50 p-2 rounded">
                <span className="text-slate-600 font-sans">Maximum Speed Attained:</span>
                <span className="font-bold text-slate-900">{telemetry.maxSpeedMs} m/s</span>
              </div>

              <div className="flex justify-between bg-slate-50 p-2 rounded">
                <span className="text-slate-600 font-sans">Waypoints Completed:</span>
                <span className="font-bold text-emerald-700">2 / 6</span>
              </div>

              <div className="flex justify-between bg-slate-50 p-2 rounded">
                <span className="text-slate-600 font-sans">Under-Ice Segments Dived:</span>
                <span className="font-bold text-rose-600">1 (WP-03 → WP-04)</span>
              </div>

              <div className="flex justify-between bg-slate-50 p-2 rounded">
                <span className="text-slate-600 font-sans">Dead Reckoning Error (Dive):</span>
                <span className="font-bold text-slate-800">0.85 m per 100 m</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
