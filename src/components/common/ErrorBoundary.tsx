import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SAGAR-PRAHARI Dashboard Error Boundary caught an exception:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-slate-900 border border-slate-700 rounded-lg text-white max-w-2xl mx-auto my-12 shadow-2xl space-y-4">
          <div className="flex items-center space-x-3 text-rose-500 border-b border-slate-800 pb-3">
            <ShieldAlert className="w-8 h-8 shrink-0" />
            <div>
              <h2 className="text-base font-bold uppercase tracking-wider font-outfit">
                Ground Control Exception Caught
              </h2>
              <p className="text-xs text-slate-400 font-mono">React Boundary Isolated System Fault</p>
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded border border-slate-800 text-xs font-mono text-rose-300 overflow-x-auto">
            {this.state.error?.toString() || 'Unknown UI Error'}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-400">Telemetry streams & Sentinel hardware safety MCU remain active.</span>
            <button
              onClick={this.handleReset}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-xs font-bold shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset UI Module</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
