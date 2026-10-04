import React, { useState } from 'react';
import { TelemetryState, Waypoint, IceHazard } from '../../types/telemetry';
import { Compass, Layers, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface AntarcticMissionMapProps {
  telemetry: TelemetryState;
  waypoints: Waypoint[];
  hazards: IceHazard[];
  showUncertainty?: boolean;
  heightClass?: string;
}

export const AntarcticMissionMap: React.FC<AntarcticMissionMapProps> = ({
  telemetry,
  waypoints,
  hazards,
  showUncertainty = true,
  heightClass = 'h-[460px]'
}) => {
  const [selectedLayer, setSelectedLayer] = useState<'ice' | 'bathymetry' | 'radar'>('ice');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);

  // SVG Projection mapping for demo coordinates (Prydz Bay / Southern Ocean)
  // Lat range: -58° S to -66° S | Lng range: 50° E to 72° E
  const projectCoords = (lat: number, lng: number) => {
    const minLat = -66.5;
    const maxLat = -57.5;
    const minLng = 48.0;
    const maxLng = 73.0;

    const xPct = ((lng - minLng) / (maxLng - minLng)) * 100;
    const yPct = ((maxLat - lat) / (maxLat - minLat)) * 100;

    return { x: xPct, y: yPct };
  };

  const vehiclePos = projectCoords(telemetry.latitude, telemetry.longitude);

  const waypointPoints = waypoints.map(wp => {
    const { x, y } = projectCoords(wp.lat, wp.lng);
    return { ...wp, x, y };
  });

  // Polyline points
  const plannedPathD = waypointPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}%`).join(' ');

  // Under-ice segment between WP-03 and WP-04
  const wp03 = waypointPoints.find(w => w.id === 'WP-03');
  const wp04 = waypointPoints.find(w => w.id === 'WP-04');

  return (
    <div className={`relative bg-slate-900 rounded-lg overflow-hidden border border-slate-300 shadow-sm ${heightClass} flex flex-col`}>
      
      {/* Top Map Bar */}
      <div className="bg-slate-900/90 backdrop-blur-xs text-white px-3 py-2 flex items-center justify-between border-b border-slate-800 z-10">
        <div className="flex items-center space-x-2 text-xs font-semibold">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>Southern Ocean Mission Map (Prydz Bay Sector)</span>
          <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 font-mono">
            EPSG:3031 Polar Stereographic
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Layer Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-800 px-2 py-1 rounded text-xs">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedLayer}
              onChange={(e) => setSelectedLayer(e.target.value as any)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer font-medium"
            >
              <option value="ice" className="bg-slate-900 text-white">Sea Ice Concentration Layer</option>
              <option value="bathymetry" className="bg-slate-900 text-white">IBCSO Bathymetry (GEBCO)</option>
              <option value="radar" className="bg-slate-900 text-white">SAR Sentinel-1 Ice Radar</option>
            </select>
          </div>

          <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded">
            <button 
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))} 
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))} 
              className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Viewport */}
      <div className="relative flex-1 bg-[#1a385c] overflow-hidden ocean-grid select-none">
        
        {/* Synthetic Antarctic Oceanic Bathymetry & Ice Background */}
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: `${vehiclePos.x}% ${vehiclePos.y}%` }}
        >
          {/* Antarctic Ice Shelf Coastline visual */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            
            {/* Bathymetry contours */}
            <path d="M 0,90 Q 25,80 50,85 T 100,75 L 100,100 L 0,100 Z" fill="#0f2540" opacity="0.7" />
            <path d="M 0,95 Q 35,90 60,92 T 100,88 L 100,100 L 0,100 Z" fill="#e2f1f8" opacity="0.95" />
            
            {/* Continent label */}
            <text x="30" y="96" fill="#0f2942" fontSize="3.5" fontWeight="bold" letterSpacing="0.2em" opacity="0.6">
              ANTARCTICA (ICE SHELF EDGE)
            </text>
            <text x="65" y="70" fill="#ffffff" fontSize="2.8" fontStyle="italic" opacity="0.3">
              Southern Ocean
            </text>

            {/* Latitude Grid Lines */}
            <line x1="0" y1="20" x2="100" y2="20" stroke="#385880" strokeDasharray="1,1" strokeWidth="0.2" />
            <text x="2" y="19" fill="#7dd3fc" fontSize="1.8" fontFamily="monospace">58°S</text>

            <line x1="0" y1="40" x2="100" y2="40" stroke="#385880" strokeDasharray="1,1" strokeWidth="0.2" />
            <text x="2" y="39" fill="#7dd3fc" fontSize="1.8" fontFamily="monospace">60°S</text>

            <line x1="0" y1="60" x2="100" y2="60" stroke="#385880" strokeDasharray="1,1" strokeWidth="0.2" />
            <text x="2" y="59" fill="#7dd3fc" fontSize="1.8" fontFamily="monospace">62°S</text>

            <line x1="0" y1="80" x2="100" y2="80" stroke="#385880" strokeDasharray="1,1" strokeWidth="0.2" />
            <text x="2" y="79" fill="#7dd3fc" fontSize="1.8" fontFamily="monospace">64°S</text>

            {/* Longitude Grid Lines */}
            <line x1="20" y1="0" x2="20" y2="100" stroke="#385880" strokeDasharray="1,1" strokeWidth="0.2" />
            <text x="21" y="98" fill="#7dd3fc" fontSize="1.8" fontFamily="monospace">50°E</text>

            <line x1="40" y1="0" x2="40" y2="100" stroke="#385880" strokeDasharray="1,1" strokeWidth="0.2" />
            <text x="41" y="98" fill="#7dd3fc" fontSize="1.8" fontFamily="monospace">55°E</text>

            <line x1="60" y1="0" x2="60" y2="100" stroke="#385880" strokeDasharray="1,1" strokeWidth="0.2" />
            <text x="61" y="98" fill="#7dd3fc" fontSize="1.8" fontFamily="monospace">60°E</text>

            <line x1="80" y1="0" x2="80" y2="100" stroke="#385880" strokeDasharray="1,1" strokeWidth="0.2" />
            <text x="81" y="98" fill="#7dd3fc" fontSize="1.8" fontFamily="monospace">65°E</text>

            {/* Ice Hazard Circles */}
            {hazards.map((h) => {
              const hp = projectCoords(h.lat, h.lng);
              return (
                <g key={h.id}>
                  <circle cx={`${hp.x}%`} cy={`${hp.y}%`} r="4.5" fill="#ef4444" fillOpacity="0.2" stroke="#ef4444" strokeWidth="0.4" strokeDasharray="0.8,0.8" />
                  <circle cx={`${hp.x}%`} cy={`${hp.y}%`} r="1" fill="#ef4444" />
                  <text x={`${hp.x + 1.5}%`} y={`${hp.y}%`} fill="#fca5a5" fontSize="1.8" fontWeight="bold">
                    {h.id}: {h.type}
                  </text>
                </g>
              );
            })}

            {/* Planned Route Polyline */}
            <path d={plannedPathD} fill="none" stroke="#60a5fa" strokeWidth="0.6" strokeDasharray="1.2,1.2" />

            {/* Completed Track Line */}
            {waypointPoints.slice(0, 3).length > 1 && (
              <path
                d={waypointPoints.slice(0, 3).map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}%`).join(' ')}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="0.9"
              />
            )}

            {/* Under-Ice Dive Segment (WP-03 to WP-04) */}
            {wp03 && wp04 && (
              <line 
                x1={`${wp03.x}%`} 
                y1={`${wp03.y}%`} 
                x2={`${wp04.x}%`} 
                y2={`${wp04.y}%`} 
                stroke="#f43f5e" 
                strokeWidth="0.8" 
                strokeDasharray="1,0.8" 
              />
            )}

            {/* Waypoint Markers */}
            {waypointPoints.map((wp) => (
              <g key={wp.id} className="cursor-pointer">
                <circle cx={`${wp.x}%`} cy={`${wp.y}%`} r="1.1" fill={wp.status === 'COMPLETED' ? '#0ea5e9' : wp.status === 'ACTIVE' ? '#eab308' : '#64748b'} stroke="#ffffff" strokeWidth="0.3" />
                <text x={`${wp.x + 1.2}%`} y={`${wp.y - 0.8}%`} fill="#e2e8f0" fontSize="1.6" fontWeight="semibold">
                  {wp.id}
                </text>
              </g>
            ))}

            {/* Uncertainty Covariance Ellipse around current vehicle position */}
            {showUncertainty && (
              <g>
                {/* 2σ Uncertainty */}
                <ellipse 
                  cx={`${vehiclePos.x}%`} 
                  cy={`${vehiclePos.y}%`} 
                  rx="4.2" 
                  ry="2.8" 
                  fill="#38bdf8" 
                  fillOpacity="0.12" 
                  stroke="#38bdf8" 
                  strokeWidth="0.3" 
                  strokeDasharray="0.8,0.8" 
                />
                {/* 1σ Uncertainty */}
                <ellipse 
                  cx={`${vehiclePos.x}%`} 
                  cy={`${vehiclePos.y}%`} 
                  rx="2.1" 
                  ry="1.4" 
                  fill="#38bdf8" 
                  fillOpacity="0.2" 
                  stroke="#38bdf8" 
                  strokeWidth="0.4" 
                />
              </g>
            )}

            {/* Vehicle Marker SP-01 */}
            <g transform={`translate(${vehiclePos.x * 10}, ${vehiclePos.y * 10})`}>
              {/* Heading vector pulse */}
              <circle cx={`${vehiclePos.x}%`} cy={`${vehiclePos.y}%`} r="1.6" fill="#fbbf24" fillOpacity="0.3" className="animate-ping" />
              {/* Yellow ASV Yellow-Hull indicator dot */}
              <circle cx={`${vehiclePos.x}%`} cy={`${vehiclePos.y}%`} r="1.3" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.4" />
            </g>
          </svg>

          {/* HTML Overlay Marker for Vehicle Icon & Tooltip */}
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
            style={{ left: `${vehiclePos.x}%`, top: `${vehiclePos.y}%` }}
            onClick={() => setShowTooltip(!showTooltip)}
          >
            <div className="relative group">
              <div 
                className="w-7 h-7 bg-amber-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-slate-900 font-bold transition-transform duration-300 hover:scale-110"
                style={{ transform: `rotate(${telemetry.headingDeg}deg)` }}
                title={`SP-01 | Heading ${telemetry.headingDeg}°`}
              >
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-slate-950 mb-0.5" />
              </div>

              {/* Popup Scientific Tooltip */}
              {showTooltip && (
                <div className="absolute left-8 -top-8 bg-slate-900/95 border border-slate-700 text-white text-[11px] p-2.5 rounded-md shadow-xl w-52 pointer-events-none z-30">
                  <div className="font-bold text-cyan-400 border-b border-slate-700 pb-1 mb-1.5 flex justify-between">
                    <span>{telemetry.vehicleId}</span>
                    <span className="text-[10px] text-emerald-400 font-mono">GNSS Q: {telemetry.gnssQuality}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 font-mono text-[10px]">
                    <div><span className="text-slate-400">Lat:</span> {telemetry.latitude.toFixed(4)}°S</div>
                    <div><span className="text-slate-400">Lon:</span> {telemetry.longitude.toFixed(4)}°E</div>
                    <div><span className="text-slate-400">Mode:</span> <span className="text-amber-300 font-bold">{telemetry.mode}</span></div>
                    <div><span className="text-slate-400">Depth:</span> {telemetry.depthMeters.toFixed(2)} m</div>
                    <div><span className="text-slate-400">Speed:</span> {telemetry.speedMs.toFixed(2)} m/s</div>
                    <div><span className="text-slate-400">Heading:</span> {telemetry.headingDeg.toFixed(1)}°</div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Map Map Overlay Legend Card */}
        <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-700 text-white p-2.5 rounded-md text-[11px] backdrop-blur-xs shadow-md z-10 w-48">
          <div className="font-semibold text-slate-300 border-b border-slate-800 pb-1 mb-1.5 text-[10px] uppercase tracking-wider">
            Map Layers & Legend
          </div>
          <div className="space-y-1.5 text-[10px]">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-0.5 border-t border-dashed border-blue-400 inline-block" />
              <span className="text-slate-300">Planned Route</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-0.5 bg-cyan-400 inline-block" />
              <span className="text-slate-300">Completed Track</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-0.5 border-t border-dashed border-rose-500 inline-block" />
              <span className="text-slate-300">Under-Ice Segment</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full border border-red-500 bg-red-500/30 inline-block" />
              <span className="text-slate-300">Ice Hazard Zone</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white inline-block" />
              <span className="text-slate-300">Current Position (SP-01)</span>
            </div>
            {showUncertainty && (
              <div className="flex items-center space-x-2">
                <span className="w-3 h-2 rounded-full border border-sky-400 bg-sky-400/20 inline-block" />
                <span className="text-slate-300">Uncertainty (Covariance)</span>
              </div>
            )}
          </div>
        </div>

        {/* Map Scale Bar & Compass Rose (Bottom Left & Right) */}
        <div className="absolute bottom-3 left-3 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-700 text-white text-[10px] font-mono flex items-center space-x-3 backdrop-blur-xs z-10">
          <span>0</span>
          <div className="w-12 h-1 bg-slate-200 relative">
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-900" />
          </div>
          <span>10</span>
          <span>20</span>
          <span>40 km</span>
        </div>

        <div className="absolute bottom-3 right-3 bg-slate-900/80 p-2 rounded-full border border-slate-700 text-cyan-400 font-bold text-xs flex flex-col items-center justify-center w-8 h-8 backdrop-blur-xs z-10 shadow-md">
          <span>N</span>
          <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-cyan-400 mt-0.5" />
        </div>

      </div>

    </div>
  );
};
