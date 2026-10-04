import React from 'react';
import { 
  LayoutDashboard, 
  Navigation, 
  Route, 
  ShieldAlert, 
  Anchor, 
  Zap, 
  Droplets, 
  CloudRain, 
  CheckCircle2, 
  Sliders, 
  HeartPulse, 
  FileText 
} from 'lucide-react';

export type ScreenId = 
  | 'overview'
  | 'live-vehicle'
  | 'track-uncertainty'
  | 'hazards-ice'
  | 'dive-log'
  | 'power'
  | 'ocean-science'
  | 'atmosphere-waves'
  | 'data-quality'
  | 'commands'
  | 'health'
  | 'reports';

interface SidebarProps {
  activeScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
}

interface NavItem {
  id: ScreenId;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'live-vehicle', label: 'Live Vehicle', icon: Navigation },
  { id: 'track-uncertainty', label: 'Track & Uncertainty', icon: Route },
  { id: 'hazards-ice', label: 'Hazards & Ice', icon: ShieldAlert, badge: '1 Alert' },
  { id: 'dive-log', label: 'Dive Log', icon: Anchor },
  { id: 'power', label: 'Power', icon: Zap },
  { id: 'ocean-science', label: 'Ocean Science', icon: Droplets },
  { id: 'atmosphere-waves', label: 'Atmosphere & Waves', icon: CloudRain },
  { id: 'data-quality', label: 'Data Quality', icon: CheckCircle2 },
  { id: 'commands', label: 'Commands', icon: Sliders },
  { id: 'health', label: 'Health', icon: HeartPulse },
  { id: 'reports', label: 'Reports', icon: FileText },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeScreen, onSelectScreen }) => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-[calc(100vh-4rem)] flex flex-col border-r border-slate-800 shrink-0 select-none">
      
      {/* Navigation Links */}
      <div className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
          Mission Control
        </div>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectScreen(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                  isActive ? 'bg-blue-800 text-amber-300' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer System Specs */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400">
        <div className="flex justify-between items-center mb-1">
          <span className="font-semibold text-slate-300">Software Stack</span>
          <span className="text-emerald-400 font-mono text-[10px]">Tier 1 Valid</span>
        </div>
        <div className="text-[10px] space-y-0.5 font-mono text-slate-400">
          <div>ROS 2 Jazzy • ArduPilot</div>
          <div>FastAPI • TimescaleDB</div>
        </div>
      </div>

    </aside>
  );
};
