import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="loader-overlay">
      <div className="text-center mb-10 space-y-2">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-900 mx-auto flex items-center justify-center text-cyan-300 font-bold shadow-lg">
          <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L2 19h20L12 2zm0 4.5l6.5 11h-13L12 6.5z"/>
          </svg>
        </div>
        <h1 className="text-lg font-black tracking-wider text-white font-outfit uppercase">SAGAR-PRAHARI</h1>
        <p className="text-xs text-sky-400 font-mono">Initializing Ground Control Telemetry Pipeline...</p>
      </div>

      {/* User Banter Loader */}
      <div className="banter-loader">
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
      </div>

      <div className="mt-12 text-[11px] text-slate-400 font-mono">
        MoES / NCPOR (PS-26065) • Connecting ROS 2 Jazzy Nodes...
      </div>
    </div>
  );
};
