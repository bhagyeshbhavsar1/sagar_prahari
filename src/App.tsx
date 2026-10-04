import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, ScreenId } from './components/layout/Sidebar';
import { Loader } from './components/common/Loader';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import {
  getInitialTelemetryState,
  generate24hHistory,
  INITIAL_WAYPOINTS,
  INITIAL_HAZARDS,
  INITIAL_DIVE_LOGS,
  INITIAL_SENSOR_QC,
  INITIAL_COMMAND_LOG
} from './services/mockData';
import { TelemetryState, CommandLogItem } from './types/telemetry';
import { ShieldCheck, Loader2 } from 'lucide-react';

// Lazy loading all 12 screen modules for code-splitting & performance optimization
const OverviewScreen = lazy(() => import('./components/screens/OverviewScreen').then(m => ({ default: m.OverviewScreen })));
const LiveVehicleScreen = lazy(() => import('./components/screens/LiveVehicleScreen').then(m => ({ default: m.LiveVehicleScreen })));
const TrackUncertaintyScreen = lazy(() => import('./components/screens/TrackUncertaintyScreen').then(m => ({ default: m.TrackUncertaintyScreen })));
const HazardsIceScreen = lazy(() => import('./components/screens/HazardsIceScreen').then(m => ({ default: m.HazardsIceScreen })));
const DiveLogScreen = lazy(() => import('./components/screens/DiveLogScreen').then(m => ({ default: m.DiveLogScreen })));
const PowerScreen = lazy(() => import('./components/screens/PowerScreen').then(m => ({ default: m.PowerScreen })));
const OceanScienceScreen = lazy(() => import('./components/screens/OceanScienceScreen').then(m => ({ default: m.OceanScienceScreen })));
const AtmosphereWavesScreen = lazy(() => import('./components/screens/AtmosphereWavesScreen').then(m => ({ default: m.AtmosphereWavesScreen })));
const DataQualityScreen = lazy(() => import('./components/screens/DataQualityScreen').then(m => ({ default: m.DataQualityScreen })));
const CommandsScreen = lazy(() => import('./components/screens/CommandsScreen').then(m => ({ default: m.CommandsScreen })));
const HealthDiagnosticsScreen = lazy(() => import('./components/screens/HealthDiagnosticsScreen').then(m => ({ default: m.HealthDiagnosticsScreen })));
const ReportsScreen = lazy(() => import('./components/screens/ReportsScreen').then(m => ({ default: m.ReportsScreen })));

// Skeleton fallback while loading dynamic screen modules
const ScreenSkeleton = () => (
  <div className="flex flex-col items-center justify-center min-h-[500px] space-y-3">
    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    <span className="text-xs font-mono text-slate-500">Loading Telemetry Module...</span>
  </div>
);

export function App() {
  const [loading, setLoading] = useState<boolean>(true);
  
  // Persistent Dark Theme state with localStorage fallback
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('sp_theme');
    return saved !== null ? saved === 'dark' : true;
  });

  // Persistent Active Screen state
  const [activeScreen, setActiveScreen] = useState<ScreenId>(() => {
    const saved = localStorage.getItem('sp_active_screen') as ScreenId;
    return saved || 'overview';
  });

  const [telemetry, setTelemetry] = useState<TelemetryState>(getInitialTelemetryState());
  const [history24h, setHistory24h] = useState(generate24hHistory());
  const [waypoints, setWaypoints] = useState(INITIAL_WAYPOINTS);
  const [hazards, setHazards] = useState(INITIAL_HAZARDS);
  const [diveLogs, setDiveLogs] = useState(INITIAL_DIVE_LOGS);
  const [sensorQCList, setSensorQCList] = useState(INITIAL_SENSOR_QC);
  const [commandLog, setCommandLog] = useState<CommandLogItem[]>(INITIAL_COMMAND_LOG);

  // Initial Banter Loader timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Sync Dark Theme class to body and localStorage
  useEffect(() => {
    localStorage.setItem('sp_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDark]);

  // Sync Active Screen to localStorage
  useEffect(() => {
    localStorage.setItem('sp_active_screen', activeScreen);
  }, [activeScreen]);

  // Keyboard Shortcuts Handler for Operators (1-9 to switch screens, D to toggle dark mode)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLTextAreaElement) {
        return; // Don't interrupt input fields
      }
      
      const screens: ScreenId[] = [
        'overview', 'live-vehicle', 'track-uncertainty', 'hazards-ice', 
        'dive-log', 'power', 'ocean-science', 'atmosphere-waves', 
        'data-quality', 'commands', 'health', 'reports'
      ];

      if (e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key, 10) - 1;
        if (screens[idx]) setActiveScreen(screens[idx]);
      } else if (e.key.toLowerCase() === 'd') {
        setIsDark(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Live telemetry pulse tick effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry((prev) => {
        const d = new Date();
        const timeStr = d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
        
        const speedDelta = (Math.random() * 0.04 - 0.02);
        const headingDelta = (Math.random() * 0.8 - 0.4);
        
        return {
          ...prev,
          timestampUTC: timeStr,
          speedMs: Math.max(0.45, Math.min(1.15, +(prev.speedMs + speedDelta).toFixed(2))),
          headingDeg: +((prev.headingDeg + headingDelta + 360) % 360).toFixed(1),
          commsLastContactSecAgo: Math.floor(Math.random() * 3) + 1
        };
      });
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const handleExecuteCommand = useCallback((cmdText: string, approvalNeeded: boolean) => {
    const newLog: CommandLogItem = {
      id: commandLog.length + 33,
      timestampUTC: new Date().toISOString().slice(11, 19),
      command: cmdText,
      issuedBy: 'Operator (Ground Control)',
      status: 'Success',
      approvalState: approvalNeeded ? 'APPROVED' : 'SYSTEM_AUTO'
    };
    setCommandLog(prev => [newLog, ...prev]);

    if (cmdText.includes('Set Mode ->')) {
      const newMode = cmdText.split('->')[1].trim() as any;
      setTelemetry(prev => ({ ...prev, mode: newMode }));
    }
  }, [commandLog.length]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${isDark ? 'bg-[#0b1329] text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      
      {/* Shared Mission Header */}
      <Header telemetry={telemetry} isDark={isDark} onToggleTheme={setIsDark} />

      {/* Main Workspace Layout (Sidebar + Screen Content) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Nav Sidebar */}
        <Sidebar activeScreen={activeScreen} onSelectScreen={setActiveScreen} />

        {/* Dynamic Screen View Container with Error Boundary & Suspense */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto max-w-[1920px] mx-auto w-full">
          <ErrorBoundary>
            <Suspense fallback={<ScreenSkeleton />}>
              {activeScreen === 'overview' && (
                <OverviewScreen 
                  telemetry={telemetry} 
                  waypoints={waypoints} 
                  hazards={hazards} 
                  history24h={history24h} 
                />
              )}

              {activeScreen === 'live-vehicle' && (
                <LiveVehicleScreen 
                  telemetry={telemetry} 
                  history24h={history24h} 
                />
              )}

              {activeScreen === 'track-uncertainty' && (
                <TrackUncertaintyScreen 
                  telemetry={telemetry} 
                  waypoints={waypoints} 
                  hazards={hazards} 
                  history24h={history24h} 
                />
              )}

              {activeScreen === 'hazards-ice' && (
                <HazardsIceScreen 
                  telemetry={telemetry} 
                  hazards={hazards} 
                  waypoints={waypoints} 
                  history24h={history24h} 
                />
              )}

              {activeScreen === 'dive-log' && (
                <DiveLogScreen diveLogs={diveLogs} />
              )}

              {activeScreen === 'power' && (
                <PowerScreen 
                  telemetry={telemetry} 
                  history24h={history24h} 
                />
              )}

              {activeScreen === 'ocean-science' && (
                <OceanScienceScreen 
                  telemetry={telemetry} 
                  history24h={history24h} 
                />
              )}

              {activeScreen === 'atmosphere-waves' && (
                <AtmosphereWavesScreen 
                  telemetry={telemetry} 
                  history24h={history24h} 
                />
              )}

              {activeScreen === 'data-quality' && (
                <DataQualityScreen sensorQCList={sensorQCList} />
              )}

              {activeScreen === 'commands' && (
                <CommandsScreen 
                  telemetry={telemetry} 
                  commandLog={commandLog} 
                  waypoints={waypoints} 
                  onExecuteCommand={handleExecuteCommand} 
                />
              )}

              {activeScreen === 'health' && (
                <HealthDiagnosticsScreen 
                  telemetry={telemetry} 
                  history24h={history24h} 
                />
              )}

              {activeScreen === 'reports' && (
                <ReportsScreen 
                  telemetry={telemetry} 
                  history24h={history24h} 
                />
              )}
            </Suspense>
          </ErrorBoundary>
        </main>

      </div>

      {/* Operational Ground Station Footer Status Bar */}
      <footer className="bg-white border-t border-slate-200 px-4 py-1.5 text-xs text-slate-500 flex flex-wrap items-center justify-between font-mono z-30 select-none transition-colors duration-300">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 text-emerald-500 font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data integrity: VERIFIED</span>
          </span>
          <span>•</span>
          <span>NCPOR Southern Ocean Science Plan</span>
        </div>

        <div className="flex items-center space-x-4 text-[11px]">
          <span>ROS 2 Jazzy</span>
          <span>|</span>
          <span>ArduPilot Rover</span>
          <span>|</span>
          <span>FastAPI</span>
          <span>|</span>
          <span>PostgreSQL / TimescaleDB</span>
          <span>|</span>
          <span className="text-emerald-500 font-bold">● All Systems Nominal</span>
        </div>
      </footer>

    </div>
  );
}
