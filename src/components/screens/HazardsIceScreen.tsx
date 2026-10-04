import React from 'react';
import { TelemetryState, IceHazard, Waypoint } from '../../types/telemetry';
import { AntarcticMissionMap } from '../map/AntarcticMissionMap';
import { ShieldAlert, AlertTriangle, Snowflake, Eye, Radio } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface HazardsIceScreenProps {
  telemetry: TelemetryState;
  hazards: IceHazard[];
  waypoints: Waypoint[];
  history24h: any[];
}

export const HazardsIceScreen: React.FC<HazardsIceScreenProps> = ({
  telemetry,
  hazards,
  waypoints,
  history24h
}) => {
  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Hazards & Sea-Ice Monitoring</span>
          </h2>
          <p className="text-xs text-slate-500">
            Scanning Sonar (Ping360) + Optical Mast Camera Ice Classifier • Sea Ice Concentration (SIC %)
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="bg-amber-50 text-amber-800 border border-amber-300 px-3 py-1 rounded font-bold">
            Alert Status: 1 WARNING
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Map View with Ice Concentration Layer (7 Cols) */}
        <div className="lg:col-span-7">
          <div className="dashboard-card p-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Sea Ice Layer & Hazard Detection Zone
            </h3>
            <AntarcticMissionMap 
              telemetry={telemetry} 
              waypoints={waypoints} 
              hazards={hazards}
              heightClass="h-[460px]"
            />
          </div>
        </div>

        {/* Right Details & Charts (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Current Ice Status Cards */}
          <div className="dashboard-card p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
              Ice Environment Metrics
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500 font-sans">Current Sea-Ice Concentration</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{telemetry.seaIceConcentrationPct}%</div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${telemetry.seaIceConcentrationPct}%` }} />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500 font-sans">Ice Classification</div>
                <div className="text-sm font-bold text-slate-800 mt-1">{telemetry.iceTypeClassification}</div>
                <div className="text-[10px] text-slate-400 mt-1">Classification: Sentinel SAR</div>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500 font-sans">Estimated Ice Draft / Thickness</div>
                <div className="text-lg font-bold text-cyan-700 mt-0.5">{telemetry.estimatedIceThicknessM} m</div>
                <div className="text-[10px] text-slate-400 mt-1">Upward Sonar Scan</div>
              </div>

              <div className="bg-slate-50 p-3 rounded border border-slate-200">
                <div className="text-[10px] text-slate-500 font-sans">Active Detected Hazards</div>
                <div className="text-lg font-bold text-amber-600 mt-0.5">{hazards.length} Zones</div>
                <div className="text-[10px] text-slate-400 mt-1">Margin 2.1 km</div>
              </div>
            </div>
          </div>

          {/* Detected Hazards List Table */}
          <div className="dashboard-card p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">
              Detected Object & Ice Floe Registry
            </h3>

            <div className="space-y-2">
              {hazards.map((h) => (
                <div key={h.id} className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-start justify-between text-xs">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                        h.severity === 'WARNING' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                        h.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 border border-red-300' :
                        'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}>
                        {h.id} • {h.severity}
                      </span>
                      <span className="font-semibold text-slate-800">{h.type}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 font-mono">
                      Distance: {h.distanceKm} km | Ice Conc: {h.iceConcentration}% | Floe Size: {h.floeSizeMeters} m
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ice Concentration Along Track Chart */}
          <div className="dashboard-card p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">
              Ice Concentration Along Track (24 h Trend)
            </h3>

            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history24h}>
                  <XAxis dataKey="timeLabel" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="iceConcentration" name="Ice Conc (%)" stroke="#0284c7" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
