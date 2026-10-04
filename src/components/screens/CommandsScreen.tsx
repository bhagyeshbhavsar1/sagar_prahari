import React, { useState } from 'react';
import { TelemetryState, CommandLogItem, Waypoint } from '../../types/telemetry';
import { Sliders, Send, AlertTriangle, ShieldCheck, CheckCircle2, RotateCcw, Play, Square, Navigation } from 'lucide-react';

interface CommandsScreenProps {
  telemetry: TelemetryState;
  commandLog: CommandLogItem[];
  waypoints: Waypoint[];
  onExecuteCommand: (cmd: string, approvalNeeded: boolean) => void;
}

export const CommandsScreen: React.FC<CommandsScreenProps> = ({
  telemetry,
  commandLog,
  waypoints,
  onExecuteCommand
}) => {
  const [selectedMode, setSelectedMode] = useState<string>('SURFACE TRANSIT');
  const [selectedCmdType, setSelectedCmdType] = useState<string>('Set Waypoint');
  const [inputLat, setInputLat] = useState<string>('-62.2540');
  const [inputLng, setInputLng] = useState<string>('59.4655');

  // Confirmation Modal state
  const [pendingCmd, setPendingCmd] = useState<string | null>(null);

  const handleQuickAction = (cmdName: string, isDangerous: boolean) => {
    if (isDangerous) {
      setPendingCmd(cmdName);
    } else {
      onExecuteCommand(cmdName, false);
    }
  };

  const confirmPendingCmd = () => {
    if (pendingCmd) {
      onExecuteCommand(pendingCmd, true);
      setPendingCmd(null);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <span>Command & Telecommand Interface (Ground Control Station)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Encrypted RS-485 / Iridium Telecommands • Approval Safety Gating • Autonomous Failsafe Interlocks
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded font-bold">
            Interlock Gated: READY
          </span>
        </div>
      </div>

      {/* Safety Confirmation Modal */}
      {pendingCmd && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-slate-300 shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center space-x-3 text-amber-600 border-b border-slate-100 pb-3">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Safety Approval Required</h3>
                <p className="text-xs text-slate-500">Autonomous Failsafe Interlock Notice</p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded text-xs text-amber-900">
              <div className="font-bold">Are you sure you want to issue this telecommand?</div>
              <div className="font-mono text-xs font-black mt-1 text-slate-900 bg-white p-2 rounded border border-amber-300">
                {pendingCmd}
              </div>
              <p className="mt-2 text-[11px] text-amber-800">
                This command alters physical vehicle state or initiates ballast pneumatic dive routines. Minimum reserve battery must be &gt;20%.
              </p>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button 
                onClick={() => setPendingCmd(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
              >
                Cancel Command
              </button>
              <button 
                onClick={confirmPendingCmd}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold shadow-xs"
              >
                Confirm & Dispatch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Command Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Col: Quick Actions & Custom Command Builder (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Quick Actions */}
          <div className="dashboard-card p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
              Quick Mission Actions
            </h3>

            <div className="space-y-2">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-500 font-medium">Select Transit Mode</label>
                <div className="flex space-x-2">
                  <select
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded text-xs p-2 font-mono"
                  >
                    <option value="SURFACE TRANSIT">SURFACE TRANSIT</option>
                    <option value="UNDERWAY SAMPLING">UNDERWAY SAMPLING</option>
                    <option value="SHALLOW DIVE">SHALLOW DIVE (0-6m)</option>
                    <option value="ICE AVOIDANCE">ICE AVOIDANCE</option>
                    <option value="STATION KEEPING">STATION KEEPING</option>
                    <option value="SENTINEL MODE">SENTINEL MODE</option>
                  </select>
                </div>
                <button
                  onClick={() => handleQuickAction(`Set Mode -> ${selectedMode}`, false)}
                  className="w-full mt-1.5 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Mode Telecommand</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickAction('Start Ocean Sampling Routine', false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-2 rounded text-xs font-semibold text-left border border-slate-300 flex items-center space-x-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-blue-600" />
                  <span>Start Sampling</span>
                </button>

                <button
                  onClick={() => handleQuickAction('Capture Mast Forward Photo', false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 p-2 rounded text-xs font-semibold text-left border border-slate-300 flex items-center space-x-1.5"
                >
                  <Play className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Take Photo</span>
                </button>

                <button
                  onClick={() => handleQuickAction('Initiate Pneumatic Ballast Dive (1.5 m)', true)}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-900 p-2 rounded text-xs font-bold text-left border border-amber-300 flex items-center space-x-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Start Dive (1.5m)</span>
                </button>

                <button
                  onClick={() => handleQuickAction('EMERGENCY ABORT & BLOW MBT', true)}
                  className="bg-red-50 hover:bg-red-100 text-red-900 p-2 rounded text-xs font-bold text-left border border-red-300 flex items-center space-x-1.5"
                >
                  <Square className="w-3.5 h-3.5 text-red-600" />
                  <span>Abort / Surface</span>
                </button>
              </div>
            </div>
          </div>

          {/* Single Command Builder */}
          <div className="dashboard-card p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
              Custom Waypoint Command Builder
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-500 font-medium">Target Latitude (°S)</label>
                <input
                  type="text"
                  value={inputLat}
                  onChange={(e) => setInputLat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 p-2 rounded font-mono mt-1"
                />
              </div>

              <div>
                <label className="text-slate-500 font-medium">Target Longitude (°E)</label>
                <input
                  type="text"
                  value={inputLng}
                  onChange={(e) => setInputLng(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 p-2 rounded font-mono mt-1"
                />
              </div>

              <button
                onClick={() => handleQuickAction(`Set Waypoint (${inputLat}°, ${inputLng}°)`)}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white p-2 rounded text-xs font-bold shadow-xs"
              >
                + Add Waypoint to Queue
              </button>
            </div>
          </div>

        </div>

        {/* Center & Right Col: Waypoints Queue & Command History (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Active Mission & Waypoint Queue */}
          <div className="dashboard-card p-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Current Mission Plan & Waypoints Queue
              </h3>
              <span className="text-xs font-mono text-emerald-700 font-bold">Mission Progress: 33% (2/6 WP)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {waypoints.map((wp, idx) => (
                <div key={wp.id} className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center justify-between text-xs font-mono">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${
                        wp.status === 'COMPLETED' ? 'bg-blue-600' :
                        wp.status === 'ACTIVE' ? 'bg-amber-500 animate-pulse' :
                        'bg-slate-400'
                      }`} />
                      <span className="font-bold text-slate-900">{wp.id}: {wp.name}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {wp.lat.toFixed(4)}° S, {wp.lng.toFixed(4)}° E
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    wp.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                    wp.status === 'ACTIVE' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-200 text-slate-600'
                  }`}>
                    {wp.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Command Audit Log */}
          <div className="dashboard-card p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
              Telecommand Dispatch Audit Log
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 text-[10px]">
                    <th className="p-2">#</th>
                    <th className="p-2">Time (UTC)</th>
                    <th className="p-2">Command</th>
                    <th className="p-2">Issued By</th>
                    <th className="p-2">Approval State</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {commandLog.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50">
                      <td className="p-2 text-slate-400">{log.id}</td>
                      <td className="p-2 font-bold text-slate-800">{log.timestampUTC}</td>
                      <td className="p-2 font-sans font-semibold text-slate-900">{log.command}</td>
                      <td className="p-2 font-sans text-slate-600">{log.issuedBy}</td>
                      <td className="p-2">
                        <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-300">
                          {log.approvalState}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
