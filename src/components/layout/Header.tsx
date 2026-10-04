import React, { useState, useEffect } from 'react';
import { TelemetryState } from '../../types/telemetry';
import { ThemeSwitch } from '../common/ThemeSwitch';
import { Radio, Clock, User, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  telemetry: TelemetryState;
  isDark: boolean;
  onToggleTheme: (dark: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ telemetry, isDark, onToggleTheme }) => {
  const [timeUtc, setTimeUtc] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hours = d.getUTCHours().toString().padStart(2, '0');
      const minutes = d.getUTCMinutes().toString().padStart(2, '0');
      const seconds = d.getUTCSeconds().toString().padStart(2, '0');
      const dateStr = d.toISOString().slice(0, 10);
      setTimeUtc(`${hours}:${minutes}:${seconds} UTC (${dateStr})`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs transition-colors duration-300">
      <div className="max-w-full px-4 h-16 flex items-center justify-between">
        
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-white font-bold shadow-xs">
            <svg className="w-6 h-6 fill-current text-cyan-300" viewBox="0 0 24 24">
              <path d="M12 2L2 19h20L12 2zm0 4.5l6.5 11h-13L12 6.5z"/>
              <path d="M7 16l5-7 5 7H7z" opacity="0.6"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-slate-900 text-lg tracking-tight font-outfit">SAGAR-PRAHARI</span>
              <span className="bg-slate-100 text-slate-700 border border-slate-300 text-xs px-2 py-0.5 rounded font-mono font-medium">
                PS-26065
              </span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              MoES / NCPOR — Autonomous Polar Ocean Observation Platform
            </div>
          </div>
        </div>

        {/* Center Quick Mission Context */}
        <div className="hidden lg:flex items-center space-x-6 bg-slate-50 px-4 py-1.5 rounded-lg border border-slate-200/80">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-medium">Vehicle ID:</span>
            <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
              {telemetry.vehicleId}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center space-x-2 text-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-700">LIVE</span>
            <span className="text-slate-500">• Mission Active</span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
            <Radio className="w-3.5 h-3.5 text-blue-600" />
            <span>Comms:</span>
            <span className="font-semibold text-slate-800">{telemetry.commsLinkStatus}</span>
            <span className="text-slate-400">({telemetry.commsLastContactSecAgo}s ago)</span>
          </div>
        </div>

        {/* Right Controls: Dark/Light Switch & UTC Clock */}
        <div className="flex items-center space-x-4">
          
          {/* User Custom Animated Theme Switch Button */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Theme:</span>
            <ThemeSwitch isDark={isDark} onToggle={onToggleTheme} />
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          <div className="hidden sm:flex flex-col items-end">
            <div className="flex items-center space-x-1.5 text-xs font-mono font-medium text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{timeUtc || '08:31:12 UTC'}</span>
            </div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>ROS 2 / FastAPI Connected</span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block" />

          {/* User / Operator Avatar */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-full border border-slate-200">
            <div className="w-7 h-7 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
