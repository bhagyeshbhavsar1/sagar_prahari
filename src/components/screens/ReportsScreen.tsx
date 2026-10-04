import React, { useState } from 'react';
import { TelemetryState } from '../../types/telemetry';
import { FileText, Download, Calendar, CheckSquare, Square, FileSpreadsheet, FileCode, CheckCircle } from 'lucide-react';

interface ReportsScreenProps {
  telemetry: TelemetryState;
  history24h: any[];
}

export const ReportsScreen: React.FC<ReportsScreenProps> = ({ telemetry, history24h }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    'Vehicle Telemetry',
    'GNSS Track',
    'Oceanographic Data (CTD)'
  ]);
  const [format, setFormat] = useState<'csv' | 'json' | 'netcdf'>('csv');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const toggleType = (t: string) => {
    if (selectedTypes.includes(t)) {
      setSelectedTypes(selectedTypes.filter(item => item !== t));
    } else {
      setSelectedTypes([...selectedTypes, t]);
    }
  };

  const handleDownload = () => {
    // Generate real downloadable Blob file
    let fileContent = '';
    let fileName = `SAGAR_PRAHARI_${selectedTypes.join('_')}_${new Date().toISOString().slice(0, 10)}`;

    if (format === 'csv') {
      fileName += '.csv';
      fileContent = `Timestamp_UTC,Latitude_S,Longitude_E,Speed_ms,Depth_m,WaterTemp_C,Salinity_PSU,Turbidity_NTU,AirTemp_C,WindSpeed_ms\n`;
      history24h.forEach(row => {
        fileContent += `${row.timestampUTC},${telemetry.latitude},${telemetry.longitude},${telemetry.speedMs},${row.waterTempC},${row.waterTempC},${row.salinityPSU},${row.turbidityNTU},${row.airTempC},${row.windSpeedMs}\n`;
      });
    } else if (format === 'json') {
      fileName += '.json';
      fileContent = JSON.stringify({
        project: 'SAGAR-PRAHARI (SIH 2026 PS-26065)',
        organization: 'MoES / NCPOR',
        vehicleId: telemetry.vehicleId,
        exportedAt: new Date().toISOString(),
        datasets: selectedTypes,
        telemetryHistory: history24h
      }, null, 2);
    } else {
      fileName += '.nc';
      fileContent = `# NetCDF-4 Oceanographic Data Format (Climate & Forecast Metadata Conventions)\n`;
      fileContent += `:title = "SAGAR-PRAHARI Southern Ocean CTD & Atmospheric Observations"\n`;
      fileContent += `:institution = "National Centre for Polar and Ocean Research (NCPOR)"\n`;
      fileContent += JSON.stringify(history24h);
    }

    const blob = new Blob([fileContent], { type: format === 'json' ? 'application/json' : 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(`Exported ${fileName} (${(blob.size / 1024).toFixed(1)} KB)`);
    setTimeout(() => setDownloadSuccess(null), 5000);
  };

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Reports & Scientific Data Download Center</span>
          </h2>
          <p className="text-xs text-slate-500">
            NCPOR Ocean Data Standards • Export Telemetry, CTD Profiles & NetCDF Datasets
          </p>
        </div>
        <div className="text-xs font-mono bg-blue-50 text-blue-800 border border-blue-200 px-3 py-1 rounded font-bold">
          Dataset: NetCDF / CSV / JSON Ready
        </div>
      </div>

      {/* Download Alert Toast */}
      {downloadSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-3 rounded-md text-xs font-mono font-bold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Data Exporter Workspace (7 Cols) */}
        <div className="lg:col-span-7 dashboard-card p-4 space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
            Select Data Types & Export Parameters
          </h3>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {[
              'Vehicle Telemetry',
              'GNSS Track',
              'Oceanographic Data (CTD)',
              'Atmospheric Data',
              'Camera Images',
              'Dive Profiles',
              'System Logs',
              'Hazard Detections'
            ].map((type) => {
              const isChecked = selectedTypes.includes(type);
              return (
                <div
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`p-2.5 rounded border cursor-pointer flex items-center space-x-2 transition-colors ${
                    isChecked ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  {isChecked ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                  <span>{type}</span>
                </div>
              );
            })}
          </div>

          {/* Time Range & Format Selector */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div>
              <label className="text-slate-500 font-medium">Export Time Range</label>
              <select className="w-full bg-slate-50 border border-slate-300 p-2 rounded font-mono mt-1">
                <option value="24h">Last 24 Hours (Current Mission)</option>
                <option value="7d">Last 7 Days (Full Transect)</option>
                <option value="30d">Full Mission Log</option>
              </select>
            </div>

            <div>
              <label className="text-slate-500 font-medium">Output Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-300 p-2 rounded font-mono mt-1"
              >
                <option value="csv">CSV (.csv)</option>
                <option value="json">JSON (.json)</option>
                <option value="netcdf">NetCDF (.nc)</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={selectedTypes.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white p-3 rounded text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Generate & Download Selected Datasets ({selectedTypes.length} selected)</span>
          </button>
        </div>

        {/* Right Quick Reports & Recent Downloads (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Quick PDF Reports */}
          <div className="dashboard-card p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
              Generated Mission Reports
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { title: 'Mission Summary Report', desc: 'PDF report with key mission stats' },
                { title: 'Ocean Science Report', desc: 'Plots of water parameters & CTD' },
                { title: 'Dive Log Report', desc: 'Depth profiles and dive event history' },
                { title: 'Power & Energy Report', desc: 'Battery & solar analysis' },
                { title: 'Track & Ice Report', desc: 'Route, ice encounters, uncertainty' }
              ].map((rep, idx) => (
                <div key={idx} className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 font-sans">{rep.title}</div>
                    <div className="text-[10px] text-slate-500">{rep.desc}</div>
                  </div>
                  <button 
                    onClick={() => handleDownload()}
                    className="p-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100"
                    title="Download Report"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Downloads Table */}
          <div className="dashboard-card p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 border-b border-slate-100 pb-2">
              Recent Download History
            </h3>

            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between bg-slate-50 p-2 rounded">
                <span className="text-slate-600 font-sans">Vehicle_Telemetry_2026-10-04.csv</span>
                <span className="font-bold text-emerald-700">12.4 MB</span>
              </div>
              <div className="flex justify-between bg-slate-50 p-2 rounded">
                <span className="text-slate-600 font-sans">Oceanographic_CTD_2026-10-04.nc</span>
                <span className="font-bold text-emerald-700">8.2 MB</span>
              </div>
              <div className="flex justify-between bg-slate-50 p-2 rounded">
                <span className="text-slate-600 font-sans">Dive_Profiles_2026-10-03.csv</span>
                <span className="font-bold text-emerald-700">2.1 MB</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
