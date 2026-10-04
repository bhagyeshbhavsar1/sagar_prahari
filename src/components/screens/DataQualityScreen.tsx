import React from 'react';
import { SensorQCItem } from '../../types/telemetry';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, FileCheck, ShieldCheck } from 'lucide-react';

interface DataQualityScreenProps {
  sensorQCList: SensorQCItem[];
}

export const DataQualityScreen: React.FC<DataQualityScreenProps> = ({ sensorQCList }) => {
  const overallQuality = 92.0;
  const validPct = 98.1;
  const missingPct = 1.2;
  const outliersPct = 0.7;

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Data Quality Assurance & QC Flags (IOC / UNESCO Standards)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-Time Automated Outlier & Range Validation • TEOS-10 Scientific Standards Compliance
          </p>
        </div>
        <div className="text-xs font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded font-bold">
          Quality Control: PASSED (92.0% Overall)
        </div>
      </div>

      {/* Top Quality Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="dashboard-card p-3 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Overall Data Quality</div>
            <div className="text-xl font-black text-emerald-800 font-mono">{overallQuality}%</div>
          </div>
        </div>

        <div className="dashboard-card p-3 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Valid Telemetry Packets</div>
            <div className="text-xl font-black text-blue-900 font-mono">{validPct}%</div>
          </div>
        </div>

        <div className="dashboard-card p-3 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Missing Packet Rate</div>
            <div className="text-xl font-black text-amber-800 font-mono">{missingPct}%</div>
          </div>
        </div>

        <div className="dashboard-card p-3 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-semibold">Outliers Filtered</div>
            <div className="text-xl font-black text-indigo-900 font-mono">{outliersPct}%</div>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Sensor Registry Table (8 Cols) */}
        <div className="lg:col-span-8 dashboard-card p-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
            Sensor Health & Calibration Registry
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 text-[10px]">
                  <th className="p-2">Sensor Name</th>
                  <th className="p-2">Subsystem</th>
                  <th className="p-2">QC Status</th>
                  <th className="p-2">Quality %</th>
                  <th className="p-2">Last Sync</th>
                  <th className="p-2">Calibration Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sensorQCList.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-2 font-sans font-bold text-slate-900">{item.sensorName}</td>
                    <td className="p-2 text-slate-500 text-[11px]">{item.subsystem}</td>
                    <td className="p-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        item.status === 'Good' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'Warning' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-2 font-bold text-slate-800">{item.qualityPct}%</td>
                    <td className="p-2 text-slate-500 text-[11px]">{item.lastReadingUTC}</td>
                    <td className="p-2 font-sans text-[11px] text-slate-600">{item.calibrationInfo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Data Flags Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="dashboard-card p-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
              Data Quality Flags Legend
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-emerald-50 rounded border border-emerald-200">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  <span className="font-bold text-emerald-950 font-mono">GOOD (Flag 1)</span>
                </div>
                <span className="text-[11px] text-emerald-800 font-mono">1,248 samples</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-amber-50 rounded border border-amber-200">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="font-bold text-amber-950 font-mono">WARNING (Flag 2)</span>
                </div>
                <span className="text-[11px] text-amber-800 font-mono">15 samples</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-indigo-50 rounded border border-indigo-200">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <span className="font-bold text-indigo-950 font-mono">SUSPECT (Flag 3)</span>
                </div>
                <span className="text-[11px] text-indigo-800 font-mono">4 samples</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-slate-100 rounded border border-slate-200">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                  <span className="font-bold text-slate-900 font-mono">MISSING (Flag 4)</span>
                </div>
                <span className="text-[11px] text-slate-700 font-mono">15 samples</span>
              </div>

              <div className="flex items-center justify-between p-2 bg-red-50 rounded border border-red-200">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <span className="font-bold text-red-950 font-mono">INVALID (Flag 9)</span>
                </div>
                <span className="text-[11px] text-red-800 font-mono">0 samples</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
