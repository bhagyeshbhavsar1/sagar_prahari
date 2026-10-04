import React from 'react';
import { TelemetryState, Waypoint, IceHazard } from '../../types/telemetry';
import { AntarcticMissionMap } from '../map/AntarcticMissionMap';
import { 
  Compass, 
  Gauge, 
  TrendingDown, 
  Battery, 
  Sun, 
  AlertTriangle, 
  Activity, 
  Wind, 
  Droplets, 
  Thermometer, 
  ShieldCheck, 
  Radio, 
  CheckCircle,
  Navigation
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface OverviewScreenProps {
  telemetry: TelemetryState;
  waypoints: Waypoint[];
  hazards: IceHazard[];
  history24h: any[];
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  telemetry,
  waypoints,
  hazards,
  history24h
}) => {
  return (
    <div className="space-y-4">
      
      {/* Quick Mission Status Banner Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        
        {/* Mode Status Pill */}
        <div className="flex items-center space-x-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-md">
          <Navigation className="w-4 h-4 text-blue-600 animate-pulse" />
          <span className="text-xs text-blue-700 font-medium">MODE:</span>
          <span className="text-xs font-bold text-blue-900 tracking-wide">{telemetry.mode}</span>
        </div>

        {/* Quick Indicators */}
        <div className="flex items-center space-x-6 text-xs">
          <div className="flex items-center space-x-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-500">GNSS:</span>
            <span className="font-bold text-emerald-700">GOOD ({telemetry.gnssQuality})</span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-500">COMMS LINK:</span>
            <span className="font-bold text-blue-700">{telemetry.commsLinkStatus}</span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-500">LEAK STATUS:</span>
            <span className="font-bold text-emerald-700">{telemetry.leakStatus}</span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center space-x-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-slate-500">GEOFENCE:</span>
            <span className="font-bold text-emerald-700">{telemetry.geofenceStatus}</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Mission Map (Left) & Right Telemetry Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Col: Antarctic Mission Map (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="dashboard-card p-3 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
                <Compass className="w-4 h-4 text-blue-600" />
                <span>Mission Map & Track Context</span>
              </h2>
              <span className="text-[11px] text-slate-500">Sector: Prydz Bay (Southern Ocean)</span>
            </div>
            
            <AntarcticMissionMap 
              telemetry={telemetry} 
              waypoints={waypoints} 
              hazards={hazards}
              heightClass="h-[480px]"
            />
          </div>
        </div>

        {/* Right Col: Telemetry & Environmental Stack (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Key Telemetry Card */}
          <div className="dashboard-card p-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Gauge className="w-4 h-4 text-blue-600" />
                <span>Key Telemetry</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Last update: {telemetry.timestampUTC.slice(-12)}</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                <div className="text-[10px] text-slate-500 font-medium">Heading</div>
                <div className="text-base font-bold text-slate-900 font-mono">{telemetry.headingDeg}°</div>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                <div className="text-[10px] text-slate-500 font-medium">Speed</div>
                <div className="text-base font-bold text-slate-900 font-mono">{telemetry.speedMs} m/s</div>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                <div className="text-[10px] text-slate-500 font-medium">Depth (Bar30)</div>
                <div className="text-base font-bold text-slate-900 font-mono">{telemetry.depthMeters} m</div>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                <div className="text-[10px] text-slate-500 font-medium">GNSS Quality</div>
                <div className="text-sm font-bold text-emerald-700 font-mono">{telemetry.gnssQuality}</div>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                <div className="text-[10px] text-slate-500 font-medium">Roll / Pitch</div>
                <div className="text-xs font-bold text-slate-800 font-mono">{telemetry.rollDeg}° / {telemetry.pitchDeg}°</div>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                <div className="text-[10px] text-slate-500 font-medium">Battery (Main A)</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900 font-mono">{telemetry.mainBatterySOC}%</span>
                  <Battery className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">0.82 / 1.15 kWh</div>
              </div>
            </div>
          </div>

          {/* Environmental Conditions Card */}
          <div className="dashboard-card p-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Droplets className="w-4 h-4 text-cyan-600" />
                <span>Environmental Conditions (Latest Sample)</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Sensors: PT-1000 / EZO-EC</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="bg-cyan-50/50 p-2 rounded border border-cyan-100">
                <div className="text-[10px] text-cyan-800 font-medium">Water Temp (PT-1000)</div>
                <div className="text-base font-bold text-cyan-950 font-mono">{telemetry.waterTempC} °C</div>
              </div>

              <div className="bg-blue-50/50 p-2 rounded border border-blue-100">
                <div className="text-[10px] text-blue-800 font-medium">Practical Salinity</div>
                <div className="text-base font-bold text-blue-950 font-mono">{telemetry.practicalSalinityPSU} PSU</div>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                <div className="text-[10px] text-slate-600 font-medium">Turbidity</div>
                <div className="text-sm font-bold text-slate-900 font-mono">{telemetry.turbidityNTU} NTU</div>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                <div className="text-[10px] text-slate-600 font-medium">Chlorophyll-a</div>
                <div className="text-sm font-bold text-emerald-800 font-mono">{telemetry.chlorophyllUgl} µg/L</div>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                <div className="text-[10px] text-slate-600 font-medium">pH (EZO-pH)</div>
                <div className="text-sm font-bold text-indigo-900 font-mono">{telemetry.phValue}</div>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                <div className="text-[10px] text-slate-600 font-medium">Air Temperature</div>
                <div className="text-sm font-bold text-slate-900 font-mono">{telemetry.airTempC} °C</div>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                <div className="text-[10px] text-slate-600 font-medium">Relative Humidity</div>
                <div className="text-sm font-bold text-slate-900 font-mono">{telemetry.relativeHumidityPct} %</div>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                <div className="text-[10px] text-slate-600 font-medium">Air Pressure</div>
                <div className="text-sm font-bold text-slate-900 font-mono">{telemetry.airPressureHpa} hPa</div>
              </div>

              <div className="bg-slate-50 p-2 rounded border border-slate-200/60">
                <div className="text-[10px] text-slate-600 font-medium">Wind (Speed/Dir)</div>
                <div className="text-xs font-bold text-slate-900 font-mono">{telemetry.windSpeedMs} m/s ({telemetry.windDirectionText})</div>
              </div>
            </div>
          </div>

          {/* Solar Generation (24h) Mini Card */}
          <div className="dashboard-card p-3">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center space-x-2">
                <Sun className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Solar Deck Input (24 h)</span>
              </div>
              <div className="text-xs font-mono font-bold text-amber-700">
                Daily Total: {telemetry.solarDailyWh / 1000} kWh
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-center shrink-0">
                <div className="text-xl font-black text-amber-600 font-mono">{telemetry.solarInputWatts} W</div>
                <div className="text-[10px] text-slate-500 font-medium">Current Input</div>
              </div>

              <div className="flex-1 h-12">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history24h.slice(-12)}>
                    <Area type="monotone" dataKey="solarWatts" stroke="#f59e0b" fill="#fef3c7" strokeWidth={1.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Section: Active Alerts & Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Active Alerts (6 cols) */}
        <div className="lg:col-span-6 dashboard-card p-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Active Alerts ({hazards.length})</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Failsafe: Level 2 Watch</span>
          </div>

          <div className="space-y-2">
            <div className="bg-amber-50 border border-amber-200 rounded p-2.5 flex items-start space-x-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <div className="flex justify-between font-bold text-amber-900">
                  <span>ICE_NEAR • Surface ice detected within planning margin</span>
                  <span className="font-mono text-[10px] text-amber-700">08:28 UTC</span>
                </div>
                <div className="text-amber-800 text-[11px] mt-0.5">
                  Ice hazard detected 2.1 km ahead of current position (Concentration 78%). Autonomous ice-avoidance trajectory evaluator armed.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Events Log (6 cols) */}
        <div className="lg:col-span-6 dashboard-card p-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-blue-600" />
              <span>Recent System Events</span>
            </h3>
            <button className="text-[11px] text-blue-600 hover:underline font-medium">View All</button>
          </div>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-700 bg-slate-50 p-1.5 rounded">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-slate-500">08:31:12</span>
                <span className="font-medium text-slate-800">Telemetry packet logged (GNSS, vehicle state, CTD)</span>
              </div>
              <span className="text-[10px] text-slate-400">ROS 2</span>
            </div>

            <div className="flex items-center justify-between text-slate-700 bg-slate-50 p-1.5 rounded">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-slate-500">08:29:03</span>
                <span className="font-medium text-slate-800">Science sample stored (CTD + turbidity)</span>
              </div>
              <span className="text-[10px] text-slate-400">FastAPI</span>
            </div>

            <div className="flex items-center justify-between text-slate-700 bg-slate-50 p-1.5 rounded">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-slate-500">08:27:41</span>
                <span className="font-medium text-slate-800">Mode transition: SURFACE_TRANSIT confirmed</span>
              </div>
              <span className="text-[10px] text-slate-400">ArduPilot</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
